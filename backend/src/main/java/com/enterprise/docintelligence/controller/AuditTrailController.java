package com.enterprise.docintelligence.controller;

import com.enterprise.docintelligence.model.AuditTrailEntry;
import com.enterprise.docintelligence.service.analysis.AuditTrailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/audit-trail")
@CrossOrigin(origins = "*")
public class AuditTrailController {

    private final AuditTrailService auditTrailService;

    public AuditTrailController(AuditTrailService auditTrailService) {
        this.auditTrailService = auditTrailService;
    }

    @GetMapping
    public ResponseEntity<List<AuditTrailEntry>> getAuditTrail() {
        return ResponseEntity.ok(auditTrailService.getRecentTrail());
    }
}
