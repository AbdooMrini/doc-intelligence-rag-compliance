package com.enterprise.docintelligence.controller;

import com.enterprise.docintelligence.model.ComplianceReport;
import com.enterprise.docintelligence.repository.ComplianceReportRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/compliance")
@CrossOrigin(origins = "*")
public class ComplianceController {

    private final ComplianceReportRepository reportRepository;

    public ComplianceController(ComplianceReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @GetMapping("/reports")
    public ResponseEntity<List<ComplianceReport>> listReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }

    @GetMapping("/reports/{id}")
    public ResponseEntity<ComplianceReport> getReport(@PathVariable String id) {
        return reportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
