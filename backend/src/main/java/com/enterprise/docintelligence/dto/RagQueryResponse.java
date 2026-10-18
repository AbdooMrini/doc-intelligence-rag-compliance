package com.enterprise.docintelligence.dto;

import java.util.ArrayList;
import java.util.List;

public class RagQueryResponse {
    private String answer;
    private Double confidenceScore;
    private Double hallucinationRiskScore;
    private boolean isGrounded;
    private List<DocumentCitation> citations = new ArrayList<>();
    private String verifiableAuditToken;
    private Long queryLatencyMs;

    public RagQueryResponse() {}

    public RagQueryResponse(String answer, Double confidenceScore, Double hallucinationRiskScore, boolean isGrounded, List<DocumentCitation> citations, String verifiableAuditToken, Long queryLatencyMs) {
        this.answer = answer;
        this.confidenceScore = confidenceScore;
        this.hallucinationRiskScore = hallucinationRiskScore;
        this.isGrounded = isGrounded;
        this.citations = citations;
        this.verifiableAuditToken = verifiableAuditToken;
        this.queryLatencyMs = queryLatencyMs;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public Double getHallucinationRiskScore() { return hallucinationRiskScore; }
    public void setHallucinationRiskScore(Double hallucinationRiskScore) { this.hallucinationRiskScore = hallucinationRiskScore; }

    public boolean isGrounded() { return isGrounded; }
    public void setGrounded(boolean grounded) { isGrounded = grounded; }

    public List<DocumentCitation> getCitations() { return citations; }
    public void setCitations(List<DocumentCitation> citations) { this.citations = citations; }

    public String getVerifiableAuditToken() { return verifiableAuditToken; }
    public void setVerifiableAuditToken(String verifiableAuditToken) { this.verifiableAuditToken = verifiableAuditToken; }

    public Long getQueryLatencyMs() { return queryLatencyMs; }
    public void setQueryLatencyMs(Long queryLatencyMs) { this.queryLatencyMs = queryLatencyMs; }
}
