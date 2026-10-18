package com.enterprise.docintelligence.dto;

public class DocumentCitation {
    private String documentId;
    private String documentTitle;
    private Integer pageNumber;
    private String chunkId;
    private String exactSnippet;
    private Double vectorCosineSimilarity;
    private Double confidenceScore;
    private String cryptographicChunkHash;

    public DocumentCitation() {}

    public DocumentCitation(String documentId, String documentTitle, Integer pageNumber, String chunkId, String exactSnippet, Double vectorCosineSimilarity, Double confidenceScore, String cryptographicChunkHash) {
        this.documentId = documentId;
        this.documentTitle = documentTitle;
        this.pageNumber = pageNumber;
        this.chunkId = chunkId;
        this.exactSnippet = exactSnippet;
        this.vectorCosineSimilarity = vectorCosineSimilarity;
        this.confidenceScore = confidenceScore;
        this.cryptographicChunkHash = cryptographicChunkHash;
    }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getDocumentTitle() { return documentTitle; }
    public void setDocumentTitle(String documentTitle) { this.documentTitle = documentTitle; }

    public Integer getPageNumber() { return pageNumber; }
    public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }

    public String getChunkId() { return chunkId; }
    public void setChunkId(String chunkId) { this.chunkId = chunkId; }

    public String getExactSnippet() { return exactSnippet; }
    public void setExactSnippet(String exactSnippet) { this.exactSnippet = exactSnippet; }

    public Double getVectorCosineSimilarity() { return vectorCosineSimilarity; }
    public void setVectorCosineSimilarity(Double vectorCosineSimilarity) { this.vectorCosineSimilarity = vectorCosineSimilarity; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getCryptographicChunkHash() { return cryptographicChunkHash; }
    public void setCryptographicChunkHash(String cryptographicChunkHash) { this.cryptographicChunkHash = cryptographicChunkHash; }
}
