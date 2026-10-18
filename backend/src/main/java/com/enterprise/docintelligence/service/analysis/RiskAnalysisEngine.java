package com.enterprise.docintelligence.service.analysis;

import com.enterprise.docintelligence.model.Document;
import com.enterprise.docintelligence.model.DocumentChunk;
import com.enterprise.docintelligence.model.RiskFinding;
import com.enterprise.docintelligence.repository.RiskFindingRepository;
import com.enterprise.docintelligence.service.ingestion.SemanticChunkerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class RiskAnalysisEngine {

    private static final Logger log = LoggerFactory.getLogger(RiskAnalysisEngine.class);

    private final RiskFindingRepository riskFindingRepository;
    private final ComplianceAuditService complianceAuditService;
    private final AuditTrailService auditTrailService;

    public RiskAnalysisEngine(
            RiskFindingRepository riskFindingRepository,
            ComplianceAuditService complianceAuditService,
            AuditTrailService auditTrailService
    ) {
        this.riskFindingRepository = riskFindingRepository;
        this.complianceAuditService = complianceAuditService;
        this.auditTrailService = auditTrailService;
    }

    record RiskRule(
            String category,
            String severity,
            String title,
            Pattern pattern,
            String explanation,
            String recommendation,
            double baseConfidence
    ) {}

    private final List<RiskRule> rules = List.of(
            // Legal: Unlimited Liability
            new RiskRule(
                    "LEGAL",
                    "HIGH",
                    "Unlimited Liability / Absence of Liability Cap",
                    Pattern.compile("(?i)(unlimited liability|indemnify.*without cap|shall be liable without limitation)"),
                    "Contract lacks a standard aggregate liability limitation (e.g. 12 months fees paid), exposing company to unlimited financial damages.",
                    "Insert an express clause: 'Aggregate liability shall not exceed total fees paid in the prior 12 months'.",
                    0.96
            ),

            // Legal: Auto-Renewal Trap
            new RiskRule(
                    "LEGAL",
                    "MEDIUM",
                    "Unilateral Multi-Year Automatic Renewal",
                    Pattern.compile("(?i)(automatic(ally)? renew(al)?.*(consecutive|3-year|two years)|renew.*unless terminated.*(180|90) days)"),
                    "Agreement renews automatically for multi-year terms with an excessively long termination notice window (>90 days).",
                    "Require 30-day notice prior to renewal and negotiate 1-year annual renewal increments.",
                    0.91
            ),

            // Financial: Extended Payment Terms (>60 / >90 days)
            new RiskRule(
                    "FINANCIAL",
                    "HIGH",
                    "Unfavorable Extended Payment Terms (>60 Days)",
                    Pattern.compile("(?i)(payable within (60|90|120) days|net[ -]?(60|90|120))"),
                    "Invoice payment terms exceed standard B2B 30-day norms, creating adverse working capital and cash-flow drag.",
                    "Renegotiate payment terms to Net-30 or request a 2% prompt-payment discount for Net-10.",
                    0.94
            ),

            // Financial: Missing or Invalid VAT / Tax Identification
            new RiskRule(
                    "FINANCIAL",
                    "HIGH",
                    "Missing Tax / VAT Identifier Anomaly",
                    Pattern.compile("(?i)(vat.*(missing|unspecified|0%)|tax id.*(none|missing))"),
                    "Commercial invoice lacks a verifiable statutory tax/VAT identification number, which may trigger audit penalties.",
                    "Request revised invoice with vendor's registered VAT/Tax identification number prior to settlement.",
                    0.95
            ),

            // Financial: Usurious / High Late Payment Penalties
            new RiskRule(
                    "FINANCIAL",
                    "MEDIUM",
                    "Aggressive Late Payment Interest Penalty",
                    Pattern.compile("(?i)(late payment.*(18%|2% per month|2\\.5% per month|compound))"),
                    "Contract stipulates excessive late payment fees (above statutory interest guidelines), compounding potential dispute liability.",
                    "Cap late interest at statutory benchmark rate (e.g., ECB base rate + 3% or Federal Reserve Prime rate).",
                    0.88
            ),

            // Regulatory Compliance: GDPR Cross-Border Data Transfer
            new RiskRule(
                    "COMPLIANCE",
                    "HIGH",
                    "GDPR Cross-Border Data Transfer without DPA",
                    Pattern.compile("(?i)(transferred to third-party.*without prior consent|cross-border transfer.*no consent)"),
                    "Transfers personal identifiable data (PII) to sub-processors without mandatory GDPR Data Processing Addendum (DPA) safeguards.",
                    "Mandate execution of Standard Contractual Clauses (SCCs) and prompt notification before engaging any sub-processor.",
                    0.97
            ),

            // Legal: Offshore / Unfavorable Governing Law
            new RiskRule(
                    "LEGAL",
                    "MEDIUM",
                    "Non-Standard Governing Jurisdiction",
                    Pattern.compile("(?i)(governing law:.*(panama|cayman|bermuda|seychelles|bvi))"),
                    "Dispute resolution assigned to an offshore or foreign jurisdiction, creating substantial litigation and enforcement expenses.",
                    "Specify mutual governing law and dispute jurisdiction in Delaware, UK High Court, or Paris International Commercial Court.",
                    0.92
            )
    );

    @Transactional
    public List<RiskFinding> analyzeDocument(Document document, List<DocumentChunk> chunks) {
        log.info("Executing automated risk analysis for document: {}...", document.getTitle());

        List<RiskFinding> findings = new ArrayList<>();

        for (DocumentChunk chunk : chunks) {
            String text = chunk.getContent();

            for (RiskRule rule : rules) {
                var matcher = rule.pattern().matcher(text);
                if (matcher.find()) {
                    String snippet = extractSnippet(text, matcher.start(), matcher.end());
                    String citationHash = SemanticChunkerService.sha256(chunk.getId() + ":" + snippet);

                    RiskFinding finding = new RiskFinding(
                            UUID.randomUUID().toString(),
                            document,
                            chunk.getId(),
                            rule.category(),
                            rule.severity(),
                            rule.title(),
                            snippet,
                            rule.explanation(),
                            rule.recommendation(),
                            rule.baseConfidence(),
                            chunk.getPageNumber(),
                            citationHash
                    );

                    findings.add(finding);
                }
            }
        }

        riskFindingRepository.saveAll(findings);

        // Record Audit event
        auditTrailService.recordEvent(
                "RISKS_DETECTED",
                "Document",
                document.getId(),
                "ai-risk-engine",
                "Detected " + findings.size() + " risk findings across legal, financial, and compliance categories."
        );

        // Generate Verifiable Compliance Report
        complianceAuditService.generateReport(document, findings);

        return findings;
    }

    private String extractSnippet(String text, int start, int end) {
        int windowStart = Math.max(0, start - 60);
        int windowEnd = Math.min(text.length(), end + 100);
        return text.substring(windowStart, windowEnd).trim();
    }
}
