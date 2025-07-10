package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.Flashcard;
import com.leenglish.toeic.domain.FlashcardSet;

@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {

    List<Flashcard> findByFlashcardSetIdAndIsActiveTrue(Long flashcardSetId);

    List<Flashcard> findByLevelAndIsActiveTrue(String level);

    List<Flashcard> findByCategoryAndIsActiveTrue(String category);

    @Query("SELECT f FROM Flashcard f WHERE f.flashcardSet.id = :flashcardSetId AND f.isActive = true ORDER BY f.createdAt ASC")
    List<Flashcard> findActiveFlashcardsBySetOrderByCreated(@Param("flashcardSetId") Long flashcardSetId);

    @Query("SELECT f FROM Flashcard f WHERE LOWER(f.term) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(f.definition) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND f.isActive = true")
    List<Flashcard> searchFlashcards(@Param("searchTerm") String searchTerm);

    Long countByFlashcardSetIdAndIsActiveTrue(Long flashcardSetId);

    List<Flashcard> findByFlashcardSetId(Long flashcardSetId);

   
}
