package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.FlashcardSet;

@Repository
public interface FlashcardSetRepository extends JpaRepository<FlashcardSet, Long> {

        // ✅ FIX: Add missing methods that were referenced in service

        // Method for finding public, non-premium, active sets by ID
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.id = :id AND fs.isPublic = true AND fs.isPremium = false AND fs.isActive = true")
        Optional<FlashcardSet> findByIdAndIsPublicTrueAndIsPremiumFalseAndIsActiveTrue(@Param("id") Long id);

        // Method for finding public and active sets with pagination
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        Page<FlashcardSet> findByIsPublicTrueAndIsActiveTrue(Pageable pageable);

        // Method for finding all public and active sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        List<FlashcardSet> findByIsPublicTrueAndIsActiveTrue();

        // Method for finding set with flashcards eagerly loaded
        @EntityGraph(attributePaths = { "flashcards" })
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.id = :id")
        Optional<FlashcardSet> findWithFlashcardsById(@Param("id") Long id);

        // ✅ Main query for public and active flashcard sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        List<FlashcardSet> findPublicAndActiveFlashcardSets();

        // Find by ID and ensure it's active
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.id = :id AND fs.isActive = true")
        Optional<FlashcardSet> findByIdAndIsActiveTrue(@Param("id") Long id);

        // Find by user and active status
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.createdBy.id = :userId AND fs.isActive = true ORDER BY fs.createdAt DESC")
        Page<FlashcardSet> findByCreatedByIdAndIsActiveTrue(@Param("userId") Long userId, Pageable pageable);

        // Find public sets by category
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true AND fs.category = :category ORDER BY fs.viewCount DESC")
        List<FlashcardSet> findPublicSetsByCategory(@Param("category") String category);

        // Find public sets by difficulty
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true AND fs.difficulty = :difficulty ORDER BY fs.viewCount DESC")
        List<FlashcardSet> findPublicSetsByDifficulty(@Param("difficulty") String difficulty);

        // Search public sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true AND (fs.name LIKE %:searchTerm% OR fs.description LIKE %:searchTerm%) ORDER BY fs.viewCount DESC")
        List<FlashcardSet> searchPublicSets(@Param("searchTerm") String searchTerm);

        // Count by user
        @Query("SELECT COUNT(fs) FROM FlashcardSet fs WHERE fs.createdBy.id = :userId AND fs.isActive = true")
        long countByCreatedByIdAndIsActiveTrue(@Param("userId") Long userId);

        // Find all active sets
        List<FlashcardSet> findByIsActiveTrueOrderByCreatedAtDesc();

        // Find featured sets (most viewed)
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.isActive = true ORDER BY fs.viewCount DESC")
        List<FlashcardSet> findFeaturedPublicSets(Pageable pageable);

        

}
