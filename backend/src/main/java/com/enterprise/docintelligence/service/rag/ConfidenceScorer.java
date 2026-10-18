package com.enterprise.docintelligence.service.rag;

import org.springframework.stereotype.Service;

@Service
public class ConfidenceScorer {

    /**
     * Compute grounded confidence score (0.0 to 1.0)
     */
    public double calculateConfidence(double vectorSimilarity, double lexicalSimilarity, int chunkLength) {
        // Base confidence derived from dense vector alignment
        double base = (vectorSimilarity * 0.65) + (lexicalSimilarity * 0.35);

        // Penalize very short snippets (< 50 chars) due to low information density
        double lengthPenalty = (chunkLength < 50) ? 0.8 : 1.0;

        double finalScore = base * lengthPenalty;
        return Math.round(Math.max(0.0, Math.min(1.0, finalScore)) * 1000.0) / 1000.0;
    }

    /**
     * Compute Hallucination Risk Score (0.0 to 1.0)
     * Lower is safer. If confidence is 0.90, hallucination risk is ~0.10.
     */
    public double calculateHallucinationRisk(double confidenceScore) {
        double risk = 1.0 - confidenceScore;
        return Math.round(Math.max(0.0, Math.min(1.0, risk)) * 1000.0) / 1000.0;
    }
}
