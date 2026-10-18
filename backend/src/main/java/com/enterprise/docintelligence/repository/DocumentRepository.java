package com.enterprise.docintelligence.repository;

import com.enterprise.docintelligence.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    Optional<Document> findByHashSha256(String hashSha256);
}
