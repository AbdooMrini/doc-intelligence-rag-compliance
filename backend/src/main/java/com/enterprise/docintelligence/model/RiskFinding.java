package com.enterprise.docintelligence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "risk_findings")
public class RiskFinding {

    @Id
    @Column(length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    @JsonIgnore
    private Document document;

    @Column(name = "chunk_id", length = 36)
    private String chunkId;

    @Column(name = "risk_category", nullable = false, length = 50)
    private String riskCategory; // LEGAL, FINANCIAL, COMPLIANCE

    @Column(nullable = false, length = 20)
    private String severity; // HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String title;

    @Column(name = "clause_snippet", columnDefinition = "TEXT", nullable = false)
    private String clauseSnippet;

    @Column(name = "risk_explanation", columnDefinition = "TEXT", nullable = false)
    private String riskExplanation;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String recommendation;

    @Column(name = "confidence_score", nullable = false)
    private Double confidenceScore; // 0.0 to 1.0

    @Column(name = "page_number", nullable = false)
    private Integer pageNumber;

    @Column(name = "citation_hash", nullable = false, length = 64)
    private String citationHash;

    @Column(name = "detected_at")
    private Instant detectedAt = Instant.now();

    public RiskFinding() {}

    public RiskFinding(String id, Document document, String chunkId, String riskCategory, String severity, String title, String clauseSnippet, String riskExplanation, String recommendation, Double confidenceScore, Integer pageNumber, String citationHash) {
        this.id = id;
        this.document = document;
        this.chunkId = chunkId;
        this.riskCategory = riskCategory;
        this.severity = severity;
        this.title = title;
        this.clauseSnippet = clauseSnippet;
        this.riskExplanation = riskExplanation;
        this.recommendation = recommendation;
        this.confidenceScore = confidenceScore;
        this.pageNumber = pageNumber;
        this.citationHash = citationHash;
        this.detectedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public String getChunkId() { return chunkId; }
    public void setChunkId(String chunkId) { this.chunkId = chunkId; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getClauseSnippet() { return clauseSnippet; }
    public void setClauseSnippet(String clauseSnippet) { this.clauseSnippet = clauseSnippet; }

    public String getRiskExplanation() { return riskExplanation; }
    public void setRiskExplanation(String riskExplanation) { this.riskExplanation = riskExplanation; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public String getCitationHash() { return citationHash; }
    public void setCitationHash(String citationHash) { this.citationHash = citationHash; }

    public Instant getDetectedAt() { return detectedAt; }
    public void setDetectedAt(Instant detectedAt) { this.detectedAt = detectedAt; }
}
