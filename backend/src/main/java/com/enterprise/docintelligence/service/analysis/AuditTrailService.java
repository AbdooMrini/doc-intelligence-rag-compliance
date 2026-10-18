package com.enterprise.docintelligence.service.analysis;

import com.enterprise.docintelligence.model.AuditTrailEntry;
import com.enterprise.docintelligence.repository.AuditTrailRepository;
import com.enterprise.docintelligence.service.ingestion.SemanticChunkerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuditTrailService {

    private final AuditTrailRepository auditTrailRepository;

    public AuditTrailService(AuditTrailRepository auditTrailRepository) {
        this.auditTrailRepository = auditTrailRepository;
    }

    @Transactional
    public AuditTrailEntry recordEvent(String eventType, String entityType, String entityId, String actor, String details) {
        String id = UUID.randomUUID().toString();
        Instant now = Instant.now();

        // Compute cryptographic proof hash
        String payload = id + ":" + eventType + ":" + entityType + ":" + entityId + ":" + actor + ":" + now.toEpochMilli() + ":" + details;
        String proofHash = SemanticChunkerService.sha256(payload);

        AuditTrailEntry entry = new AuditTrailEntry(
                id,
                eventType,
                entityType,
                entityId,
                actor,
                details,
                proofHash
        );

        return auditTrailRepository.save(entry);
    }

    public List<AuditTrailEntry> getRecentTrail() {
        return auditTrailRepository.findAllByOrderByCreatedAtDesc();
    }
}
