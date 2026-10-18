export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileType: 'PDF' | 'EXCEL' | 'SCAN';
  fileSizeBytes: number;
  hashSha256: string;
  status: 'PARSED' | 'INDEXED' | 'FAILED';
  totalPages: number;
  summary?: string;
  uploadedAt: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  pageNumber: number;
  content: string;
  tokenCount: number;
  chunkHashSha256: string;
}

export interface RiskFinding {
  id: string;
  documentId: string;
  chunkId?: string;
  riskCategory: 'LEGAL' | 'FINANCIAL' | 'COMPLIANCE';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  clauseSnippet: string;
  riskExplanation: string;
  recommendation: string;
  confidenceScore: number;
  pageNumber: number;
  citationHash: string;
  detectedAt: string;
}

export interface ComplianceReport {
  id: string;
  documentId: string;
  overallScore: number;
  complianceGrade: string;
  summary: string;
  highRisksCount: number;
  mediumRisksCount: number;
  lowRisksCount: number;
  verifiedSha256ReportHash: string;
  generatedAt: string;
}

export interface DocumentCitation {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  chunkId: string;
  exactSnippet: string;
  vectorCosineSimilarity: number;
  confidenceScore: number;
  cryptographicChunkHash: string;
}

export interface RagQueryResponse {
  answer: string;
  confidenceScore: number;
  hallucinationRiskScore: number;
  isGrounded: boolean;
  citations: DocumentCitation[];
  verifiableAuditToken: string;
  queryLatencyMs: number;
}

export interface AuditTrailItem {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  actor: string;
  detailsJson: string;
  cryptographicProofHash: string;
  createdAt: string;
}
