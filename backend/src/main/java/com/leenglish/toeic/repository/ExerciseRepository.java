package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.Exercise;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

        // Find exercises by lesson
        List<Exercise> findByLessonId(Long lessonId);

        List<Exercise> findByLessonIdAndIsActiveTrue(Long lessonId);

        // Find exercises by type
        List<Exercise> findByType(String type);

        List<Exercise> findByTypeAndIsActiveTrue(String type);

        // Find exercises by level
        List<Exercise> findByLevel(String level);

        List<Exercise> findByLevelAndIsActiveTrue(String level);

        // Find exercises by difficulty
        List<Exercise> findByDifficultyLevel(String difficultyLevel);

        List<Exercise> findByDifficultyLevelAndIsActiveTrue(String difficultyLevel); // Find active exercises

        List<Exercise> findByIsActiveTrue();

        List<Exercise> findByIsActiveTrueOrderByOrderIndexAsc();

        List<Exercise> findByIsActiveTrueOrderByCreatedAtDesc();

        // Find premium exercises
        List<Exercise> findByIsPremiumTrue();

        List<Exercise> findByIsPremiumFalse();

        List<Exercise> findByIsPremiumAndIsActiveTrue(Boolean isPremium);

        // Find exercises by lesson and ordered
        List<Exercise> findByLessonIdAndIsActiveTrueOrderByOrderIndexAsc(Long lessonId);

        // Find exercises by multiple criteria
        @Query("SELECT e FROM Exercise e WHERE " +
                        "(:lessonId IS NULL OR e.lessonId = :lessonId) AND " +
                        "(:type IS NULL OR e.type = :type) AND " +
                        "(:level IS NULL OR e.level = :level) AND " +
                        "(:difficultyLevel IS NULL OR e.difficultyLevel = :difficultyLevel) AND " +
                        "(:isActive IS NULL OR e.isActive = :isActive) AND " +
                        "(:isPremium IS NULL OR e.isPremium = :isPremium)")
        List<Exercise> findByCriteria(
                        @Param("lessonId") Long lessonId,
                        @Param("type") String type,
                        @Param("level") String level,
                        @Param("difficultyLevel") String difficultyLevel,
                        @Param("isActive") Boolean isActive,
                        @Param("isPremium") Boolean isPremium);

        // Search exercises by keyword
        @Query("SELECT e FROM Exercise e WHERE " +
                        "(e.title LIKE %:keyword% OR e.description LIKE %:keyword% OR e.question LIKE %:keyword%) AND "
                        +
                        "e.isActive = true")
        List<Exercise> searchByKeyword(@Param("keyword") String keyword);

        // Find exercises with audio
        @Query("SELECT e FROM Exercise e WHERE e.audioUrl IS NOT NULL AND e.audioUrl != '' AND e.isActive = true")
        List<Exercise> findExercisesWithAudio();

        // Find exercises with images
        @Query("SELECT e FROM Exercise e WHERE e.imageUrl IS NOT NULL AND e.imageUrl != '' AND e.isActive = true")
        List<Exercise> findExercisesWithImages();

        // Count exercises by type
        @Query("SELECT COUNT(e) FROM Exercise e WHERE e.type = :type AND e.isActive = true")
        Long countByType(@Param("type") String type);

        // Count exercises by lesson
        @Query("SELECT COUNT(e) FROM Exercise e WHERE e.lessonId = :lessonId AND e.isActive = true")
        Long countByLessonId(@Param("lessonId") Long lessonId); // Find random exercises by type and level

        @Query("SELECT e FROM Exercise e WHERE e.type = :type AND e.level = :level AND e.isActive = true ORDER BY FUNCTION('RAND')")
        List<Exercise> findRandomExercises(@Param("type") String type, @Param("level") String level, Pageable pageable);

        // Find exercises by points range
        @Query("SELECT e FROM Exercise e WHERE e.points BETWEEN :minPoints AND :maxPoints AND e.isActive = true")
        List<Exercise> findByPointsRange(@Param("minPoints") Integer minPoints, @Param("maxPoints") Integer maxPoints);

        // Find exercises by title containing
        List<Exercise> findByTitleContaining(String title);

        @Query("SELECT e FROM Exercise e JOIN FETCH e.questions WHERE e.lesson.id = :lessonId AND e.isActive = true")
        List<Exercise> findByLessonIdWithQuestions(@Param("lessonId") Long lessonId);
}
