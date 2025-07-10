package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;

@Repository
public interface FlashcardSetRepository extends JpaRepository<FlashcardSet, Long> {

        // ========== BASIC METHODS ONLY ==========

        Optional<FlashcardSet> findByName(String name);

        List<FlashcardSet> findByDifficultyLevel(String difficultyLevel);

        Page<FlashcardSet> findByDifficultyLevel(String difficultyLevel, Pageable pageable);

        @Query("SELECT f FROM FlashcardSet f WHERE f.isActive = true")
        List<FlashcardSet> findActiveFlashcardSets();

        @Query("SELECT f FROM FlashcardSet f WHERE f.isActive = true")
        Page<FlashcardSet> findActiveFlashcardSets(Pageable pageable);

        @Query("SELECT COUNT(f) FROM FlashcardSet f WHERE f.isActive = true")
        long countActiveFlashcardSets();

        long countByDifficultyLevel(String difficultyLevel);

        List<FlashcardSet> findByIsActive(Boolean isActive);

        List<FlashcardSet> findByIsActiveAndIsPublic(Boolean isActive, Boolean isPublic);

        FlashcardSet findByIdAndIsActive(Long id, Boolean isActive);

        List<FlashcardSet> findByCreatedByAndIsActive(User createdBy, Boolean isActive);

        List<FlashcardSet> findByDifficultyLevelAndIsActiveAndIsPublic(
                        String difficultyLevel, Boolean isActive, Boolean isPublic);

        @Query("SELECT f FROM FlashcardSet f WHERE " +
                        "(:difficulty IS NULL OR f.difficultyLevel = :difficulty) AND " +
                        "(:category IS NULL OR f.category = :category) AND " +
                        "(:search IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND "
                        +
                        "f.isPublic = true AND f.isActive = true")
        Page<FlashcardSet> findPublicSets(@Param("difficulty") String difficulty,
                        @Param("category") String category,
                        @Param("search") String search,
                        Pageable pageable);

        @Modifying
        @Query("UPDATE FlashcardSet f SET f.viewCount = f.viewCount + 1 WHERE f.id = :id")
        void incrementViewCount(@Param("id") Long id);

        Optional<FlashcardSet> findByIdAndIsPublicTrueAndIsPremiumFalseAndIsActiveTrue(Long id);

        // Method to fetch FlashcardSet with flashcards eagerly loaded
        @EntityGraph(attributePaths = { "flashcards" })
        Optional<FlashcardSet> findWithFlashcardsById(Long id);

}
