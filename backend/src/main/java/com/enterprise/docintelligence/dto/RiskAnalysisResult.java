package com.enterprise.docintelligence.dto;

import com.enterprise.docintelligence.model.RiskFinding;
import java.util.ArrayList;
import java.util.List;

public class RiskAnalysisResult {
    private String documentId;
    private String documentTitle;
    private Integer overallComplianceScore; // 0 to 100
    private String complianceGrade;
    private Integer highRiskCount;
    private Integer mediumRiskCount;
    private Integer lowRiskCount;
    private List<RiskFinding> findings = new ArrayList<>();
    private String reportSha256Checksum;

    public RiskAnalysisResult() {}

    public RiskAnalysisResult(String documentId, String documentTitle, Integer overallComplianceScore, String complianceGrade, Integer highRiskCount, Integer mediumRiskCount, Integer lowRiskCount, List<RiskFinding> findings, String reportSha256Checksum) {
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.overallComplianceScore = overallComplianceScore;
        this.complianceGrade = complianceGrade;
        this.highRiskCount = highRiskCount;
        this.mediumRiskCount = mediumRiskCount;
        this.lowRiskCount = lowRiskCount;
        this.findings = findings;
        this.reportSha256Checksum = reportSha256Checksum;
    }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

    public Integer getOverallComplianceScore() { return overallComplianceScore; }
    public void setOverallComplianceScore(Integer overallComplianceScore) { this.overallComplianceScore = overallComplianceScore; }

    public String getComplianceGrade() { return complianceGrade; }
    public void setComplianceGrade(String complianceGrade) { this.complianceGrade = complianceGrade; }

    public Integer getHighRiskCount() { return highRiskCount; }
    public void setHighRiskCount(Integer highRiskCount) { this.highRiskCount = highRiskCount; }

    public Integer getMediumRiskCount() { return mediumRiskCount; }
    public void setMediumRiskCount(Integer mediumRiskCount) { this.mediumRiskCount = mediumRiskCount; }

    public Integer getLowRiskCount() { return lowRiskCount; }
    public void setLowRiskCount(Integer lowRiskCount) { this.lowRiskCount = lowRiskCount; }

    public List<RiskFinding> getFindings() { return findings; }
    public void setFindings(List<RiskFinding> findings) { this.findings = findings; }

    public String getReportSha256Checksum() { return reportSha256Checksum; }
    public void setReportSha256Checksum(String reportSha256Checksum) { this.reportSha256Checksum = reportSha256Checksum; }
}
