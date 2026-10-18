package com.enterprise.docintelligence.service.ingestion;

import com.enterprise.docintelligence.dto.DocumentUploadResponse;
import com.enterprise.docintelligence.model.Document;
import com.enterprise.docintelligence.model.DocumentChunk;
import com.enterprise.docintelligence.repository.DocumentChunkRepository;
import com.enterprise.docintelligence.repository.DocumentRepository;
import com.enterprise.docintelligence.service.analysis.AuditTrailService;
import com.enterprise.docintelligence.service.analysis.RiskAnalysisEngine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MultiFormatIngestionService {

    private static final Logger log = LoggerFactory.getLogger(MultiFormatIngestionService.class);

    private final DocumentRepository documentRepository;
    private final DocumentChunkRepository chunkRepository;
    private final PdfParserService pdfParserService;
    private final ExcelParserService excelParserService;
    private final SemanticChunkerService semanticChunkerService;
    private final RiskAnalysisEngine riskAnalysisEngine;
    private final AuditTrailService auditTrailService;

    public MultiFormatIngestionService(
            DocumentRepository documentRepository,
            DocumentChunkRepository chunkRepository,
            PdfParserService pdfParserService,
            ExcelParserService excelParserService,
            SemanticChunkerService semanticChunkerService,
            RiskAnalysisEngine riskAnalysisEngine,
            AuditTrailService auditTrailService
    ) {
        this.documentRepository = documentRepository;
        this.chunkRepository = chunkRepository;
        this.pdfParserService = pdfParserService;
        this.excelParserService = excelParserService;
        this.semanticChunkerService = semanticChunkerService;
        this.riskAnalysisEngine = riskAnalysisEngine;
        this.auditTrailService = auditTrailService;
    }

    @Transactional
    public DocumentUploadResponse ingestDocument(MultipartFile file, String customTitle) throws Exception {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.bin";
        byte[] bytes = file.getBytes();
        String fileSha256 = SemanticChunkerService.sha256(new String(bytes));

        String fileType = determineFileType(originalFilename);
        String docId = UUID.randomUUID().toString();
        String title = (customTitle != null && !customTitle.isBlank()) ? customTitle : originalFilename;

        log.info("Starting ingestion for file: {} (Type: {}, Size: {} bytes)", originalFilename, fileType, bytes.length);

        Document document = new Document(
                docId,
                title,
                originalFilename,
                fileType,
                file.getSize(),
                fileSha256,
                "PARSING"
        );
        document = documentRepository.save(document);

        // Parse content according to file type
        List<DocumentChunk> chunksToPersist = new ArrayList<>();
        int totalPages = 1;

        try (InputStream is = file.getInputStream()) {
            if ("PDF".equals(fileType) || "SCAN".equals(fileType)) {
                var pages = pdfParserService.parsePdfPages(is);
                totalPages = Math.max(1, pages.size());
                for (var page : pages) {
                    var generated = semanticChunkerService.chunkText(page.pageNumber(), page.text(), 600, 100);
                    for (var g : generated) {
                        chunksToPersist.add(new DocumentChunk(
                                UUID.randomUUID().toString(),
                                document,
                                g.chunkIndex(),
                                g.pageNumber(),
                                g.content(),
                                g.tokenCount(),
                                g.chunkSha256()
                        ));
                    }
                }
            } else if ("EXCEL".equals(fileType)) {
                var sheets = excelParserService.parseExcelSheets(is);
                totalPages = Math.max(1, sheets.size());
                for (var sheet : sheets) {
                    var generated = semanticChunkerService.chunkText(sheet.pageNumber(), sheet.tabularText(), 700, 50);
                    for (var g : generated) {
                        chunksToPersist.add(new DocumentChunk(
                                UUID.randomUUID().toString(),
                                document,
                                g.chunkIndex(),
                                g.pageNumber(),
                                g.content(),
                                g.tokenCount(),
                                g.chunkSha256()
                        ));
                    }
                }
            }
        }

        // Save chunks
        chunkRepository.saveAll(chunksToPersist);

        document.setTotalPages(totalPages);
        document.setStatus("INDEXED");
        document.setSummary("Ingested " + totalPages + " pages/sheets with " + chunksToPersist.size() + " verifiable chunks.");
        documentRepository.save(document);

        // Record audit trail event
        auditTrailService.recordEvent(
                "DOCUMENT_INGESTED",
                "Document",
                docId,
                "system",
                "Ingested " + originalFilename + " (" + fileType + ") with SHA-256: " + fileSha256
        );

        // Run automated legal & financial risk analysis
        riskAnalysisEngine.analyzeDocument(document, chunksToPersist);

        return new DocumentUploadResponse(
                docId,
                title,
                originalFilename,
                fileType,
                file.getSize(),
                totalPages,
                chunksToPersist.size(),
                fileSha256,
                "INDEXED"
        );
    }

    private String determineFileType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".pdf")) return "PDF";
        if (lower.endsWith(".xlsx") || lower.endsWith(".xls") || lower.endsWith(".csv")) return "EXCEL";
        if (lower.endsWith(".png") || lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".tiff")) return "SCAN";
        return "PDF";
    }
}
