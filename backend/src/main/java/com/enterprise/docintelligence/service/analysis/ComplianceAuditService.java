package com.enterprise.docintelligence.service.analysis;

import com.enterprise.docintelligence.dto.RiskAnalysisResult;
import com.enterprise.docintelligence.model.ComplianceReport;
import com.enterprise.docintelligence.model.Document;
import com.enterprise.docintelligence.model.RiskFinding;
import com.enterprise.docintelligence.repository.ComplianceReportRepository;
import com.enterprise.docintelligence.service.ingestion.SemanticChunkerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ComplianceAuditService {

    private final ComplianceReportRepository reportRepository;
    private final AuditTrailService auditTrailService;

    public ComplianceAuditService(
            ComplianceReportRepository reportRepository,
            AuditTrailService auditTrailService
    ) {
        this.reportRepository = reportRepository;
        this.auditTrailService = auditTrailService;
    }

    @Transactional
    public ComplianceReport generateReport(Document document, List<RiskFinding> findings) {
        int highCount = 0;
        int mediumCount = 0;
        int lowCount = 0;

        for (RiskFinding f : findings) {
            switch (f.getSeverity()) {
                case "HIGH" -> highCount++;
                case "MEDIUM" -> mediumCount++;
                case "LOW" -> lowCount++;
            }
        }

        // Score Calculation: Start at 100, deduct penalties
        int score = 100 - (highCount * 25) - (mediumCount * 10) - (lowCount * 4);
        score = Math.max(0, Math.min(100, score));

        String grade = switch (score / 10) {
            case 10, 9 -> "AAA";
            case 8 -> "AA";
            case 7 -> "A";
            case 6 -> "B";
            case 5 -> "C";
            default -> "F";
        };

        String summary = String.format(
                "Document audit identified %d risks (%d High, %d Medium, %d Low). Overall compliance health rated %d/100 (Grade: %s).",
                findings.size(), highCount, mediumCount, lowCount, score, grade
        );

        // Compute Verifiable Cryptographic SHA-256 Proof of the report
        String reportPayload = document.getId() + ":" + score + ":" + grade + ":" + highCount + ":" + mediumCount + ":" + findings.size();
        String reportSha256 = SemanticChunkerService.sha256(reportPayload);

        ComplianceReport report = new ComplianceReport(
                UUID.randomUUID().toString(),
                document,
                score,
                grade,
                summary,
                highCount,
                mediumCount,
                lowCount,
                reportSha256
        );

        report = reportRepository.save(report);

        // Log audit event
        auditTrailService.recordEvent(
                "COMPLIANCE_REPORT_CERTIFIED",
                "ComplianceReport",
                report.getId(),
                "compliance-auditor",
                "Certified report with score: " + score + " and SHA-256 proof: " + reportSha256
        );

        return report;
    }
}
