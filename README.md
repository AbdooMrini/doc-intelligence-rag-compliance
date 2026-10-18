# Enterprise Document Intelligence & RAG Compliance Engine

[![PostgreSQL pgvector](https://img.shields.io/badge/PostgreSQL-pgvector_16-blue.svg)](https://github.com/pgvector/pgvector)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-green.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21_LTS-orange.svg)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14_App_Router-black.svg)](https://nextjs.org/)
[![Apache PDFBox](https://img.shields.io/badge/Apache-PDFBox_3.0-red.svg)](https://pdfbox.apache.org/)
[![Apache POI](https://img.shields.io/badge/Apache-POI_5.2-blueviolet.svg)](https://poi.apache.org/)
[![Docker](https://img.shields.io/badge/Docker-Orchestrated-2496ed.svg)](https://www.docker.com/)

A B2B enterprise service engineered to autonomously ingest heterogeneous business documents (contracts, invoices, specifications), detect legal and financial risks, execute hybrid vector search (RAG) with confidence scoring, and produce verifiable cryptographic audit trails to eliminate AI hallucinations.

---

## Architecture Overview

```
Heterogeneous Ingestion (PDF, Scans, Excel)
       │
       ▼
Apache PDFBox / Apache POI Parsers
       │
       ▼
Sliding-Window Semantic Chunker + SHA-256 Provenance
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
Dense Vector Embedding (384-dim)   Full-Text GIN Lexical Index
       │                                 │
       └────────────────┬────────────────┘
                        ▼
       PostgreSQL pgvector Hybrid Search (RRF)
                        │
                        ▼
      Confidence Scorer & Anti-Hallucination Gate
                        │
       ├────────────────┴────────────────┐
       ▼                                 ▼
Legal & Financial Risk Engine     Verifiable Cryptographic Audit Ledger
 (Unlimited Liability, VAT, etc.)   (Signed Compliance Certificates)
```

---

## Key Capabilities

### 1. Ingestion Pipeline for Heterogeneous Data
- **Contract & Specification PDFs**: Parsed using Apache PDFBox 3.0, preserving page bounds, sections, and metadata.
- **Financial Spreadsheets & Invoices**: Tabular parsing using Apache POI 5.2, extracting accounts, tax line items, and payment schedules.
- **Scanned Documents**: Text extraction with OCR fallback structure.
- **Sliding-Window Chunker**: Dynamically partitions documents with sentence preservation and computes per-chunk SHA-256 hashes (`chunk_hash_sha256`) for immutable referencing.

### 2. Hybrid Vector Search (RAG) with Confidence Scoring
- **PostgreSQL `pgvector`**: Performs dense cosine similarity distance retrieval:
  ```sql
  SELECT * FROM document_chunks 
  ORDER BY embedding <=> :queryEmbedding 
  LIMIT :topK;
  ```
- **Reciprocal Rank Fusion (RRF)**: Merges dense vector proximity (weight: 0.7) with full-text lexical BM25 matching (weight: 0.3).
- **Anti-Hallucination Scoring**: Evaluates signal density and cosine confidence (0.0 to 1.0). If confidence drops below threshold (0.65), the system flags hallucination risk and rejects ungrounded generation.

### 3. Legal & Financial Risk Engine
- **Legal Liabilities**: Flags missing aggregate liability caps, unilateral multi-year auto-renewals, non-standard governing laws, and aggressive non-competes.
- **Financial Discrepancies**: Detects extended payment terms (>60 or >90 days), missing/invalid statutory VAT numbers, and compound late-interest penalties.
- **Regulatory Matcher**: Identifies GDPR Article 28 cross-border data transfer anomalies and SOC 2 retention gaps.

### 4. Verifiable Cryptographic Audit Trails
- **Zero Hallucination Guarantee**: Every answer and risk finding strictly binds to an exact page number, text snippet, and immutable SHA-256 chunk hash.
- **Signed Compliance Certificates**: Generates compliance scorecards (Grades AAA to F) stamped with a tamper-evident cryptographic checksum.
- **Immutable Ledger**: Every ingestion, query, and analysis event is recorded with an immutable proof hash.

---

## Project Structure

```
doc-intelligence-rag-compliance/
├── backend/                             # Spring Boot 3.3 Core (Java 21)
│   ├── src/main/java/com/enterprise/docintelligence/
│   │   ├── config/                      # CorsConfig, PgVectorConfig
│   │   ├── controller/                  # Document, RAG, RiskAnalysis, Compliance, AuditTrail
│   │   ├── dto/                         # RagQueryRequest, RagQueryResponse, DocumentCitation
│   │   ├── model/                       # Document, DocumentChunk, RiskFinding, ComplianceReport
│   │   ├── repository/                  # Spring Data JPA + pgvector Repositories
│   │   └── service/
│   │       ├── ingestion/               # MultiFormatIngestion, PdfParser, ExcelParser, Chunker
│   │       ├── rag/                     # EmbeddingService, HybridSearchEngine, ConfidenceScorer
│   │       └── analysis/                # RiskAnalysisEngine, ComplianceAuditService, AuditTrailService
│   ├── src/main/resources/
│   │   ├── application.yml              # RAG parameters & datasource
│   │   └── schema.sql                   # pgvector extension & table creation
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                            # Next.js 14 App Router UI
│   ├── src/app/
│   │   ├── dashboard/
│   │   │   ├── documents/               # Ingestion Dropzone & Chunk Visualizer
│   │   │   ├── rag-search/              # Hybrid RAG Playground with Cosine Gauges
│   │   │   ├── risk-matrix/             # Legal & Financial Severity Breakdown
│   │   │   ├── audit-reports/           # Verified Compliance Scorecards
│   │   │   └── audit-trail/             # Cryptographic Immutable Event Stream
│   └── src/components/                  # Sidebar, Navbar, CitationViewer
│
├── docker-compose.yml                   # Spring Boot, PostgreSQL 16 pgvector, Next.js
└── README.md
```

---

## Quickstart with Docker Compose

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbdooMrini/doc-intelligence-rag-compliance.git
   cd doc-intelligence-rag-compliance
   ```

2. **Start the containers**:
   ```bash
   docker compose up -d --build
   ```

3. **Verify the services**:
   - **Compliance UI Dashboard**: [http://localhost:3000](http://localhost:3000)
   - **Spring Boot REST API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
   - **PostgreSQL pgvector**: Port `5432` (`doc_intelligence`)

---

## REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/documents/upload` | `POST` | Upload PDF, Excel, or Scan (multipart) |
| `/api/v1/documents` | `GET` | List all indexed documents & chunk counts |
| `/api/v1/rag/query` | `POST` | Execute hybrid vector search with citations |
| `/api/v1/risks/document/{id}` | `GET` | Retrieve legal & financial risk breakdown |
| `/api/v1/compliance/reports` | `GET` | List certified compliance reports |
| `/api/v1/audit-trail` | `GET` | Retrieve immutable cryptographic ledger |

---

## License
MIT License. Free for commercial and enterprise compliance automation.
