package com.enterprise.docintelligence.repository;

import com.enterprise.docintelligence.model.ComplianceReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ComplianceReportRepository extends JpaRepository<ComplianceReport, String> {
    Optional<ComplianceReport> findByDocumentId(String documentId);
}
