package com.enterprise.docintelligence.service.rag;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Arrays;

@Service
public class EmbeddingService {

    public static final int DIMENSION = 384;

    /**
     * Compute a normalized dense vector embedding for text
     */
    public float[] computeEmbedding(String text) {
        float[] vector = new float[DIMENSION];
        if (text == null || text.isBlank()) return vector;

        String[] tokens = text.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");

        for (String token : tokens) {
            if (token.length() < 2) continue;
            int hash = Math.abs(token.hashCode());
            int index = hash % DIMENSION;
            vector[index] += 1.0f;

            // Secondary feature hashing for n-grams
            if (token.length() > 4) {
                int subHash = Math.abs(token.substring(0, 4).hashCode());
                vector[(subHash + 37) % DIMENSION] += 0.5f;
            }
        }

        // L2 Normalize vector
        float norm = 0.0f;
        for (float val : vector) {
            norm += val * val;
        }
        norm = (float) Math.sqrt(norm);

        if (norm > 0) {
            for (int i = 0; i < DIMENSION; i++) {
                vector[i] /= norm;
            }
        }

        return vector;
    }

    /**
     * Calculate Cosine Similarity between two embeddings (Range: 0.0 to 1.0)
     */
    public double cosineSimilarity(float[] v1, float[] v2) {
        if (v1 == null || v2 == null || v1.length != v2.length) return 0.0;

        double dot = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < v1.length; i++) {
            dot += v1[i] * v2[i];
            normA += v1[i] * v1[i];
            normB += v2[i] * v2[i];
        }

        if (normA <= 0 || normB <= 0) return 0.0;
        double similarity = dot / (Math.sqrt(normA) * Math.sqrt(normB));
        return Math.max(0.0, Math.min(1.0, similarity));
    }
}
