package com.enterprise.docintelligence.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "audit_trail_entries")
public class AuditTrailEntry {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "event_type", nullable = false, length = 100)
    private String eventType;

    @Column(name = "entity_type", nullable = false, length = 100)
    private String entityType;

    @Column(name = "entity_id", nullable = false, length = 36)
    private String entityId;

    @Column(nullable = false, length = 100)
    private String actor;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "cryptographic_proof_hash", nullable = false, length = 64)
    private String cryptographicProofHash;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public AuditTrailEntry() {}

    public AuditTrailEntry(String id, String eventType, String entityType, String entityId, String actor, String detailsJson, String cryptographicProofHash) {
        this.id = id;
        this.eventType = eventType;
        this.entityType = entityType;
        this.entityId = entityId;
        this.actor = actor;
        this.detailsJson = detailsJson;
        this.cryptographicProofHash = cryptographicProofHash;
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getActor() { return actor; }
    public void setActor(String actor) { this.actor = actor; }

    public String getDetailsJson() { return detailsJson; }
    public void setDetailsJson(String detailsJson) { this.detailsJson = detailsJson; }

    public String getCryptographicProofHash() { return cryptographicProofHash; }
    public void setCryptographicProofHash(String cryptographicProofHash) { this.cryptographicProofHash = cryptographicProofHash; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
