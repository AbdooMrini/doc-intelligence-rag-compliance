package com.enterprise.docintelligence.dto;

import java.util.List;

public class RagQueryRequest {
    private String query;
    private List<String> documentIds;
    private Integer topK = 5;
    private Double minConfidenceScore = 0.65;
    private Double hybridAlpha = 0.7; // 0.7 vector, 0.3 lexical BM25

    public RagQueryRequest() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public List<String> getDocumentIds() { return documentIds; }
    public void setDocumentIds(List<String> documentIds) { this.documentIds = documentIds; }

    public Integer getTopK() { return topK; }
    public void setTopK(Integer topK) { this.topK = topK; }

    public Double getMinConfidenceScore() { return minConfidenceScore; }
    public void setMinConfidenceScore(Double minConfidenceScore) { this.minConfidenceScore = minConfidenceScore; }

    public Double getHybridAlpha() { return hybridAlpha; }
    public void setHybridAlpha(Double hybridAlpha) { this.hybridAlpha = hybridAlpha; }
}
