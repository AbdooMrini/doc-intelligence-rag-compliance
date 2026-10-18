package com.enterprise.docintelligence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "compliance_reports")
public class ComplianceReport {

    @Id
    @Column(length = 36)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    @JsonIgnore
    private Document document;

    @Column(name = "overall_score", nullable = false)
    private Integer overallScore; // 0 to 100

    @Column(name = "compliance_grade", nullable = false, length = 10)
    private String complianceGrade; // AAA, AA, A, B, C, F

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(name = "high_risks_count")
    private Integer highRisksCount = 0;

    @Column(name = "medium_risks_count")
    private Integer mediumRisksCount = 0;

    @Column(name = "low_risks_count")
    private Integer lowRisksCount = 0;

    @Column(name = "verified_sha256_report_hash", nullable = false, length = 64)
    private String verifiedSha256ReportHash;

    @Column(name = "generated_at")
    private Instant generatedAt = Instant.now();

    public ComplianceReport() {}

    public ComplianceReport(String id, Document document, Integer overallScore, String complianceGrade, String summary, Integer highRisksCount, Integer mediumRisksCount, Integer lowRisksCount, String verifiedSha256ReportHash) {
        this.id = id;
        this.document = document;
        this.overallScore = overallScore;
        this.complianceGrade = complianceGrade;
        this.summary = summary;
        this.highRisksCount = highRisksCount;
        this.mediumRisksCount = mediumRisksCount;
        this.lowRisksCount = lowRisksCount;
        this.verifiedSha256ReportHash = verifiedSha256ReportHash;
        this.generatedAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Document getDocument() { return document; }
    public void setDocument(Document document) { this.document = document; }

    public Integer getOverallScore() { return overallScore; }
    public void setOverallScore(Integer overallScore) { this.overallScore = overallScore; }

    public String getComplianceGrade() { return complianceGrade; }
    public void setComplianceGrade(String complianceGrade) { this.complianceGrade = complianceGrade; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public Integer getHighRisksCount() { return highRisksCount; }
    public void setHighRisksCount(Integer highRisksCount) { this.highRisksCount = highRisksCount; }

    public Integer getMediumRisksCount() { return mediumRisksCount; }
    public void setMediumRisksCount(Integer mediumRisksCount) { this.mediumRisksCount = mediumRisksCount; }

    public Integer getLowRisksCount() { return lowRisksCount; }
    public void setLowRisksCount(Integer lowRisksCount) { this.lowRisksCount = lowRisksCount; }

    public String getVerifiedSha256ReportHash() { return verifiedSha256ReportHash; }
    public void setVerifiedSha256ReportHash(String verifiedSha256ReportHash) { this.verifiedSha256ReportHash = verifiedSha256ReportHash; }

    public Instant getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(Instant generatedAt) { this.generatedAt = generatedAt; }
}
