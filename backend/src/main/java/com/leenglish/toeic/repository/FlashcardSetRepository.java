package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.FlashcardSet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardSetRepository extends JpaRepository<FlashcardSet, Long> {

        // Method for finding public, non-premium sets by ID
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.id = :id AND fs.isPublic = true AND fs.isPremium = false")
        Optional<FlashcardSet> findByIdAndIsPublicTrueAndIsPremiumFalse(@Param("id") Long id);

        // Method for finding public sets with pagination
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        Page<FlashcardSet> findByIsPublicTrue(Pageable pageable);

        // Method for finding all public sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        List<FlashcardSet> findByIsPublicTrue();

        // Method for finding set with flashcards eagerly loaded
        @EntityGraph(attributePaths = { "flashcards" })
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.id = :id")
        Optional<FlashcardSet> findWithFlashcardsById(@Param("id") Long id);

        // Main query for public flashcard sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true ORDER BY fs.viewCount DESC, fs.createdAt DESC")
        List<FlashcardSet> findPublicFlashcardSets();

        // Find by user and creator relationship
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.creator.id = :userId ORDER BY fs.createdAt DESC")
        Page<FlashcardSet> findByCreatorId(@Param("userId") Long userId, Pageable pageable);

        // Find public sets by category
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.category = :category ORDER BY fs.viewCount DESC")
        List<FlashcardSet> findPublicSetsByCategory(@Param("category") String category);

        // Find public sets by difficulty
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND fs.difficultyLevel = :difficulty ORDER BY fs.viewCount DESC")
        List<FlashcardSet> findPublicSetsByDifficulty(@Param("difficulty") String difficulty);

        // Search public sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true AND (fs.title LIKE %:searchTerm% OR fs.description LIKE %:searchTerm%) ORDER BY fs.viewCount DESC")
        List<FlashcardSet> searchPublicSets(@Param("searchTerm") String searchTerm);

        // Count by user
        @Query("SELECT COUNT(fs) FROM FlashcardSet fs WHERE fs.creator.id = :userId")
        long countByCreatorId(@Param("userId") Long userId);

        // Find by category
        List<FlashcardSet> findByCategory(String category);

        // Find by difficulty level
        List<FlashcardSet> findByDifficultyLevel(String difficultyLevel);

        // Find featured public sets
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isFeatured = true AND fs.isPublic = true ORDER BY fs.createdAt DESC")
        List<FlashcardSet> findFeaturedPublicSets(Pageable pageable);

        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isFeatured = true ORDER BY fs.createdAt DESC")
        List<FlashcardSet> findTopFeaturedFlashcardSets(Pageable pageable);

        default List<FlashcardSet> findTopFeaturedFlashcardSets(int limit) {
                return findTopFeaturedFlashcardSets(org.springframework.data.domain.PageRequest.of(0, limit));
        }

        // Search by title or description
        List<FlashcardSet> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title,
                        String description);

        @Query("SELECT fs FROM FlashcardSet fs WHERE (fs.title LIKE %:searchTerm% OR fs.description LIKE %:searchTerm%)")
        List<FlashcardSet> searchFlashcardSets(@Param("searchTerm") String searchTerm);

        // Find by creator
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.creator.id = :creatorId")
        List<FlashcardSet> findByCreatorId(@Param("creatorId") Long creatorId);

        // Find public sets by category
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.category = :category AND fs.isPublic = true")
        List<FlashcardSet> findPublicByCategory(@Param("category") String category);

        // Find public sets by difficulty
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.difficultyLevel = :difficulty AND fs.isPublic = true")
        List<FlashcardSet> findPublicByDifficulty(@Param("difficulty") String difficulty);

        // Search with pagination
        @Query("SELECT fs FROM FlashcardSet fs WHERE (fs.title LIKE %:title% OR fs.description LIKE %:description%)")
        Page<FlashcardSet> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
                        @Param("title") String title,
                        @Param("description") String description,
                        Pageable pageable);

        // Recent public sets with pagination
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true ORDER BY fs.createdAt DESC")
        Page<FlashcardSet> findByIsPublicTrueOrderByCreatedAtDesc(Pageable pageable);

        // Popular public sets with pagination
        @Query("SELECT fs FROM FlashcardSet fs WHERE fs.isPublic = true ORDER BY fs.viewCount DESC")
        Page<FlashcardSet> findByIsPublicTrueOrderByViewCountDesc(Pageable pageable);
}
