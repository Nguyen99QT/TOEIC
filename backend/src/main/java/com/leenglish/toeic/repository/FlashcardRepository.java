package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    // Find flashcards by flashcard set ID
    List<Flashcard> findByFlashcardSetId(Long flashcardSetId);

    // Find active flashcards by flashcard set ID
    @Query("SELECT f FROM Flashcard f WHERE f.flashcardSet.id = :flashcardSetId AND f.isActive = true")
    List<Flashcard> findActiveFlashcardsBySetId(@Param("flashcardSetId") Long flashcardSetId);

    // Find flashcard by ID and ensure it's active
    @Query("SELECT f FROM Flashcard f WHERE f.id = :id AND f.isActive = true")
    Optional<Flashcard> findByIdAndIsActiveTrue(@Param("id") Long id);

    // ⚡ FIXED: Count active flashcards in a set - return Long instead of Integer
    @Query("SELECT COUNT(f) FROM Flashcard f WHERE f.flashcardSet.id = :flashcardSetId AND f.isActive = true")
    Long countActiveFlashcardsBySetId(@Param("flashcardSetId") Long flashcardSetId);

    // Find all active flashcards
    List<Flashcard> findByIsActiveTrue();

    // Find by level and active status
    List<Flashcard> findByLevelAndIsActiveTrue(String level);

    // Find by category and active status
    List<Flashcard> findByCategoryAndIsActiveTrue(String category);

    // Search flashcards
    @Query("SELECT f FROM Flashcard f WHERE f.isActive = true AND (f.term LIKE %:searchTerm% OR f.definition LIKE %:searchTerm%)")
    List<Flashcard> searchFlashcards(@Param("searchTerm") String searchTerm);

    // Additional useful methods
    @Query("SELECT f FROM Flashcard f WHERE f.flashcardSet.id = :setId ORDER BY f.createdAt ASC")
    List<Flashcard> findByFlashcardSetIdOrderByCreatedAt(@Param("setId") Long setId);
}
