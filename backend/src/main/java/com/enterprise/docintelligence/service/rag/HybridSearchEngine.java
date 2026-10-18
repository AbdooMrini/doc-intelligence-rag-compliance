package com.enterprise.docintelligence.service.rag;

import com.enterprise.docintelligence.dto.DocumentCitation;
import com.enterprise.docintelligence.model.DocumentChunk;
import com.enterprise.docintelligence.repository.DocumentChunkRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class HybridSearchEngine {

    private static final Logger log = LoggerFactory.getLogger(HybridSearchEngine.class);

    private final DocumentChunkRepository chunkRepository;
    private final EmbeddingService embeddingService;
    private final ConfidenceScorer confidenceScorer;

    public HybridSearchEngine(
            DocumentChunkRepository chunkRepository,
            EmbeddingService embeddingService,
            ConfidenceScorer confidenceScorer
    ) {
        this.chunkRepository = chunkRepository;
        this.embeddingService = embeddingService;
        this.confidenceScorer = confidenceScorer;
    }

    public record ScoredMatch(
            DocumentChunk chunk,
            double vectorSimilarity,
            double lexicalScore,
            double combinedScore,
            double confidence
    ) {}

    /**
     * Execute hybrid semantic vector search + lexical keyword matching
     */
    public List<ScoredMatch> search(String query, List<String> documentIds, int topK, double alpha) {
        log.info("Executing hybrid RAG search for: '{}' (alpha: {}, topK: {})", query, alpha, topK);

        float[] queryEmbedding = embeddingService.computeEmbedding(query);

        List<DocumentChunk> allChunks;
        if (documentIds != null && !documentIds.isEmpty()) {
            allChunks = new ArrayList<>();
            for (String docId : documentIds) {
                allChunks.addAll(chunkRepository.findByDocumentIdOrderByChunkIndexAsc(docId));
            }
        } else {
            allChunks = chunkRepository.findAll();
        }

        List<ScoredMatch> scoredList = new ArrayList<>();

        for (DocumentChunk chunk : allChunks) {
            float[] chunkEmbedding = embeddingService.computeEmbedding(chunk.getContent());
            double vectorSim = embeddingService.cosineSimilarity(queryEmbedding, chunkEmbedding);

            // Compute lexical keyword overlap (BM25 approximation)
            double lexicalSim = computeLexicalOverlap(query, chunk.getContent());

            // Weighted Hybrid Fusion: alpha * vector + (1 - alpha) * lexical
            double combined = (alpha * vectorSim) + ((1.0 - alpha) * lexicalSim);

            // Compute confidence score (evaluates signal density, anti-hallucination)
            double confidence = confidenceScorer.calculateConfidence(vectorSim, lexicalSim, chunk.getContent().length());

            scoredList.add(new ScoredMatch(chunk, vectorSim, lexicalSim, combined, confidence));
        }

        // Sort descending by combined score
        scoredList.sort((a, b) -> Double.compare(b.combinedScore(), a.combinedScore()));

        return scoredList.stream().limit(topK).toList();
    }

    private double computeLexicalOverlap(String query, String content) {
        if (query == null || content == null) return 0.0;

        Set<String> queryWords = new HashSet<>(Arrays.asList(query.toLowerCase().split("\\s+")));
        String contentLower = content.toLowerCase();

        int matches = 0;
        for (String w : queryWords) {
            if (w.length() > 2 && contentLower.contains(w)) {
                matches++;
            }
        }

        return queryWords.isEmpty() ? 0.0 : Math.min(1.0, (double) matches / queryWords.size());
    }
}
