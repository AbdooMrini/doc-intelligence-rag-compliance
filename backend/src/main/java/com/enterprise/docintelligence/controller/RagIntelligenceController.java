package com.enterprise.docintelligence.controller;

import com.enterprise.docintelligence.dto.DocumentCitation;
import com.enterprise.docintelligence.dto.RagQueryRequest;
import com.enterprise.docintelligence.dto.RagQueryResponse;
import com.enterprise.docintelligence.service.analysis.AuditTrailService;
import com.enterprise.docintelligence.service.rag.ConfidenceScorer;
import com.enterprise.docintelligence.service.rag.HybridSearchEngine;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/rag")
@CrossOrigin(origins = "*")
public class RagIntelligenceController {

    private final HybridSearchEngine searchEngine;
    private final ConfidenceScorer confidenceScorer;
    private final AuditTrailService auditTrailService;

    public RagIntelligenceController(
            HybridSearchEngine searchEngine,
            ConfidenceScorer confidenceScorer,
            AuditTrailService auditTrailService
    ) {
        this.searchEngine = searchEngine;
        this.confidenceScorer = confidenceScorer;
        this.auditTrailService = auditTrailService;
    }

    @PostMapping("/query")
    public ResponseEntity<RagQueryResponse> executeQuery(@RequestBody RagQueryRequest request) {
        long startTime = System.currentTimeMillis();

        int topK = request.getTopK() != null ? request.getTopK() : 5;
        double alpha = request.getHybridAlpha() != null ? request.getHybridAlpha() : 0.7;

        var matches = searchEngine.search(request.getQuery(), request.getDocumentIds(), topK, alpha);

        List<DocumentCitation> citations = new ArrayList<>();
        double highestConfidence = 0.0;
        StringBuilder synthesizedContext = new StringBuilder();

        for (var match : matches) {
            var chunk = match.chunk();
            var doc = chunk.getDocument();

            citations.add(new DocumentCitation(
                    doc != null ? doc.getId() : "doc_unknown",
                    doc != null ? doc.getTitle() : "Referenced Document",
                    chunk.getPageNumber(),
                    chunk.getId(),
                    chunk.getContent(),
                    match.vectorSimilarity(),
                    match.confidence(),
                    chunk.getChunkHashSha256()
            ));

            if (match.confidence() > highestConfidence) {
                highestConfidence = match.confidence();
            }

            synthesizedContext.append(" [Page ").append(chunk.getPageNumber()).append("]: ")
                    .append(chunk.getContent()).append("\n");
        }

        // Determine ground truth synthesis
        boolean isGrounded = highestConfidence >= (request.getMinConfidenceScore() != null ? request.getMinConfidenceScore() : 0.65);
        double hallucinationRisk = confidenceScorer.calculateHallucinationRisk(highestConfidence);

        String answer;
        if (!isGrounded || citations.isEmpty()) {
            answer = "Insufficient grounded document evidence found to answer this question with high compliance confidence. Risk of hallucination is high (" + Math.round(hallucinationRisk * 100) + "%). Please consult the contract directly or adjust query terms.";
        } else {
            var topCitation = citations.get(0);
            answer = "According to " + topCitation.getDocumentTitle() + " (Page " + topCitation.getPageNumber() + "), the terms specify: \"" +
                    topCitation.getExactSnippet().replaceAll("\\n+", " ") +
                    "\". This finding is mathematically grounded with a hybrid vector confidence score of " +
                    Math.round(highestConfidence * 100) + "% and verifiable cryptographic hash proof: " + topCitation.getCryptographicChunkHash().substring(0, 16) + "...";
        }

        String auditToken = UUID.randomUUID().toString();
        long latency = System.currentTimeMillis() - startTime;

        auditTrailService.recordEvent(
                "RAG_QUERY_EXECUTED",
                "Query",
                auditToken,
                "compliance-analyst",
                "Query: '" + request.getQuery() + "', Confidence: " + highestConfidence + ", Grounded: " + isGrounded
        );

        return ResponseEntity.ok(new RagQueryResponse(
                answer,
                highestConfidence,
                hallucinationRisk,
                isGrounded,
                citations,
                auditToken,
                latency
        ));
    }
}
