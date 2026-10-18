package com.enterprise.docintelligence.repository;

import com.enterprise.docintelligence.model.AuditTrailEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditTrailRepository extends JpaRepository<AuditTrailEntry, String> {
    List<AuditTrailEntry> findAllByOrderByCreatedAtDesc();
    List<AuditTrailEntry> findByEntityIdOrderByCreatedAtDesc(String entityId);
}
