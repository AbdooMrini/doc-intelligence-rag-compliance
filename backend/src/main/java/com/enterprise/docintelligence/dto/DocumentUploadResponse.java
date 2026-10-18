package com.enterprise.docintelligence.dto;

public class DocumentUploadResponse {
    private String documentId;
    private String title;
    private String fileName;
    private String fileType;
    private Long fileSizeBytes;
    private Integer totalPages;
    private Integer totalChunks;
    private String hashSha256;
    private String status;

    public DocumentUploadResponse() {}

    public DocumentUploadResponse(String documentId, String title, String fileName, String fileType, Long fileSizeBytes, Integer totalPages, Integer totalChunks, String hashSha256, String status) {
        this.documentId = documentId;
        this.title = title;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSizeBytes = fileSizeBytes;
        this.totalPages = totalPages;
        this.totalChunks = totalChunks;
        this.hashSha256 = hashSha256;
        this.status = status;
    }

    public String getDocumentId() { return documentId; }
    public void setDocumentId(String documentId) { this.documentId = documentId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public Integer getTotalPages() { return totalPages; }
    public void setTotalPages(Integer totalPages) { this.totalPages = totalPages; }

    public Integer getTotalChunks() { return totalChunks; }
    public void setTotalChunks(Integer totalChunks) { this.totalChunks = totalChunks; }

    public String getHashSha256() { return hashSha256; }
    public void setHashSha256(String hashSha256) { this.hashSha256 = hashSha256; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
