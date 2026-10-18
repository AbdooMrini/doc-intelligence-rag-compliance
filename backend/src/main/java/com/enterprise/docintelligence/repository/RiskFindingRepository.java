package com.enterprise.docintelligence.repository;

import com.enterprise.docintelligence.model.RiskFinding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RiskFindingRepository extends JpaRepository<RiskFinding, String> {
    List<RiskFinding> findByDocumentIdOrderBySeverityAsc(String documentId);
    List<RiskFinding> findBySeverity(String severity);
}
