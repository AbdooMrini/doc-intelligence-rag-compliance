-- Enable pgvector extension for high-performance cosine similarity searches
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- PDF, EXCEL, SCAN
    file_size_bytes BIGINT NOT NULL,
    hash_sha256 VARCHAR(64) NOT NULL,
    status VARCHAR(50) NOT NULL, -- PARSED, INDEXED, FAILED
    total_pages INT DEFAULT 1,
    summary TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Document Chunks Table with Vector Embeddings
CREATE TABLE IF NOT EXISTS document_chunks (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    page_number INT NOT NULL,
    content TEXT NOT NULL,
    embedding vector(384),
    token_count INT NOT NULL,
    chunk_hash_sha256 VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hybrid Search Full-Text GIN Index
CREATE INDEX IF NOT EXISTS idx_chunks_content_tsv ON document_chunks USING gin(to_tsvector('english', content));

-- Legal & Financial Risk Findings Table
CREATE TABLE IF NOT EXISTS risk_findings (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) REFERENCES documents(id) ON DELETE CASCADE,
    chunk_id VARCHAR(36) REFERENCES document_chunks(id) ON DELETE SET NULL,
    risk_category VARCHAR(50) NOT NULL, -- LEGAL, FINANCIAL, COMPLIANCE
    severity VARCHAR(20) NOT NULL, -- HIGH, MEDIUM, LOW
    title VARCHAR(255) NOT NULL,
    clause_snippet TEXT NOT NULL,
    risk_explanation TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    page_number INT NOT NULL,
    citation_hash VARCHAR(64) NOT NULL,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Reports Table
CREATE TABLE IF NOT EXISTS compliance_reports (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) REFERENCES documents(id) ON DELETE CASCADE,
    overall_score INT NOT NULL, -- 0 to 100
    compliance_grade VARCHAR(10) NOT NULL, -- AAA, AA, A, B, C, F
    summary TEXT NOT NULL,
    high_risks_count INT DEFAULT 0,
    medium_risks_count INT DEFAULT 0,
    low_risks_count INT DEFAULT 0,
    verified_sha256_report_hash VARCHAR(64) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verifiable Immutable Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_trail_entries (
    id VARCHAR(36) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    actor VARCHAR(100) NOT NULL,
    details_json TEXT,
    cryptographic_proof_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
