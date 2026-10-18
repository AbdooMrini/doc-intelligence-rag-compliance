package com.enterprise.docintelligence.service.ingestion;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;

@Service
public class SemanticChunkerService {

    public record GeneratedChunk(
            int chunkIndex,
            int pageNumber,
            String content,
            int tokenCount,
            String chunkSha256
    ) {}

    public List<GeneratedChunk> chunkText(int pageNumber, String text, int maxChunkSize, int overlap) {
        List<GeneratedChunk> chunks = new ArrayList<>();
        if (text == null || text.isBlank()) return chunks;

        String[] paragraphs = text.split("\n\n");
        StringBuilder currentChunk = new StringBuilder();
        int chunkIdx = 0;

        for (String para : paragraphs) {
            String trimmed = para.trim();
            if (trimmed.isEmpty()) continue;

            if (currentChunk.length() + trimmed.length() > maxChunkSize && currentChunk.length() > 0) {
                String chunkStr = currentChunk.toString().trim();
                chunks.add(new GeneratedChunk(
                        chunkIdx++,
                        pageNumber,
                        chunkStr,
                        estimateTokens(chunkStr),
                        sha256(chunkStr)
                ));

                // Sliding window overlap
                if (overlap > 0 && currentChunk.length() > overlap) {
                    currentChunk = new StringBuilder(currentChunk.substring(currentChunk.length() - overlap));
                } else {
                    currentChunk = new StringBuilder();
                }
            }

            if (currentChunk.length() > 0) currentChunk.append("\n");
            currentChunk.append(trimmed);
        }

        if (currentChunk.length() > 0) {
            String chunkStr = currentChunk.toString().trim();
            chunks.add(new GeneratedChunk(
                    chunkIdx,
                    pageNumber,
                    chunkStr,
                    estimateTokens(chunkStr),
                    sha256(chunkStr)
            ));
        }

        return chunks;
    }

    private int estimateTokens(String text) {
        if (text == null || text.isEmpty()) return 0;
        // Approximation: ~4 chars per token in English legal text
        return Math.max(1, text.length() / 4);
    }

    public static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm missing", e);
        }
    }
}
