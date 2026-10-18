package com.enterprise.docintelligence.repository;

import com.enterprise.docintelligence.model.DocumentChunk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, String> {

    List<DocumentChunk> findByDocumentIdOrderByChunkIndexAsc(String documentId);

    // Full-Text Search fallback query
    @Query(value = "SELECT * FROM document_chunks WHERE to_tsvector('english', content) @@ plainto_tsquery('english', :query) LIMIT :limit", nativeQuery = true)
    List<DocumentChunk> searchByFullText(@Param("query") String query, @Param("limit") int limit);
}
