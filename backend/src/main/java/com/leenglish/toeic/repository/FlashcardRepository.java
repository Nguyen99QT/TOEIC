package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    // Find flashcards by flashcard set ID
    List<Flashcard> findByFlashcardSetId(Long flashcardSetId);

    // Find flashcards by flashcard set ID and order by creation date ascending
    List<Flashcard> findByFlashcardSetIdOrderByCreatedAtAsc(Long flashcardSetId);

    // Find active flashcards by flashcard set ID
    @Query("SELECT f FROM Flashcard f WHERE f.flashcardSet.id = :setId AND f.isActive = true")
    List<Flashcard> findActiveFlashcardsBySetId(@Param("setId") Long setId);

    // Find all active flashcards
    List<Flashcard> findByIsActiveTrue();

    // Find by level and active status
    List<Flashcard> findByLevelAndIsActiveTrue(String level);

    // Find by category and active status
    @Query("SELECT f FROM Flashcard f WHERE f.flashcardSet.category = :category AND f.isActive = true")
    List<Flashcard> findByCategoryAndIsActiveTrue(@Param("category") String category);

    // Search flashcards
    @Query("SELECT f FROM Flashcard f WHERE f.isActive = true AND (f.term LIKE %:searchTerm% OR f.definition LIKE %:searchTerm%)")
    List<Flashcard> searchFlashcards(@Param("searchTerm") String searchTerm);

    // Delete flashcards by flashcard set ID
    void deleteByFlashcardSetId(Long flashcardSetId);

    // Count active flashcards by flashcard set ID
    @Query("SELECT COUNT(f) FROM Flashcard f WHERE f.flashcardSet.id = :setId AND f.isActive = true")
    int countActiveFlashcardsBySetId(@Param("setId") Long setId);

    // NEW: Count flashcards by flashcard set ID (any status)
    @Query("SELECT COUNT(f) FROM Flashcard f WHERE f.flashcardSet.id = :setId")
    int countByFlashcardSetId(@Param("setId") Long setId);
}
