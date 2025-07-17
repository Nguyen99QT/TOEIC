package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.ExerciseResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ================================================================
 * EXERCISE RESULT REPOSITORY
 * ================================================================
 */
@Repository
public interface ExerciseResultRepository extends JpaRepository<ExerciseResult, Long> {

    /**
     * Find exercise result by user and exercise (latest attempt)
     */
    @Query("SELECT er FROM ExerciseResult er WHERE er.user.id = :userId AND er.exercise.id = :exerciseId ORDER BY er.attemptNumber DESC")
    Optional<ExerciseResult> findByUserIdAndExerciseId(@Param("userId") Long userId,
            @Param("exerciseId") Long exerciseId);

    /**
     * Check if user has completed an exercise
     */
    @Query("SELECT CASE WHEN COUNT(er) > 0 THEN true ELSE false END FROM ExerciseResult er WHERE er.user.id = :userId AND er.exercise.id = :exerciseId AND er.isCompleted = true")
    boolean isExerciseCompletedByUser(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    /**
     * Get all completed exercise IDs for a user
     */
    @Query("SELECT DISTINCT er.exercise.id FROM ExerciseResult er WHERE er.user.id = :userId AND er.isCompleted = true")
    List<Long> findCompletedExerciseIdsByUserId(@Param("userId") Long userId);

    /**
     * Get all exercise results for a user
     */
    @Query("SELECT er FROM ExerciseResult er WHERE er.user.id = :userId ORDER BY er.createdAt DESC")
    List<ExerciseResult> findByUserId(@Param("userId") Long userId);

    /**
     * Get exercise results for a specific lesson and user
     */
    @Query("SELECT er FROM ExerciseResult er WHERE er.user.id = :userId AND er.lesson.id = :lessonId ORDER BY er.createdAt DESC")
    List<ExerciseResult> findByUserIdAndLessonId(@Param("userId") Long userId, @Param("lessonId") Long lessonId);

    /**
     * Count completed exercises for a user in a specific lesson
     */
    @Query("SELECT COUNT(DISTINCT er.exercise.id) FROM ExerciseResult er WHERE er.user.id = :userId AND er.lesson.id = :lessonId AND er.isCompleted = true")
    Long countCompletedExercisesByUserAndLesson(@Param("userId") Long userId, @Param("lessonId") Long lessonId);

    /**
     * Get user's best score for an exercise
     */
    @Query("SELECT MAX(er.score) FROM ExerciseResult er WHERE er.user.id = :userId AND er.exercise.id = :exerciseId")
    Optional<Double> findBestScoreByUserAndExercise(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);

    /**
     * Get all attempts for a specific user and exercise
     */
    @Query("SELECT er FROM ExerciseResult er WHERE er.user.id = :userId AND er.exercise.id = :exerciseId ORDER BY er.attemptNumber ASC")
    List<ExerciseResult> findAllAttemptsByUserAndExercise(@Param("userId") Long userId,
            @Param("exerciseId") Long exerciseId);

    /**
     * Find next attempt number for user and exercise
     */
    @Query("SELECT COALESCE(MAX(er.attemptNumber), 0) + 1 FROM ExerciseResult er WHERE er.user.id = :userId AND er.exercise.id = :exerciseId")
    Integer findNextAttemptNumber(@Param("userId") Long userId, @Param("exerciseId") Long exerciseId);
}
