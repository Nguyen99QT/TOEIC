package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.Question;
import com.leenglish.toeic.enums.DifficultyLevel;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // ================================================================
    // EXISTING METHODS
    // ================================================================

    /**
     * Lấy questions của exercise theo thứ tự
     */
    List<Question> findByExerciseIdAndIsActiveTrueOrderByQuestionOrder(Long exerciseId);

    /**
     * Lấy free questions cho guests
     */
    @Query("SELECT q FROM Question q WHERE q.exercise.isPremium = false AND q.isActive = true")
    List<Question> findByExercise_IsFreeTrue();

    // ================================================================
    // NEW: DIFFICULTY LEVEL METHODS
    // ================================================================

    /**
     * Lấy questions theo exercise và difficulty level
     */
    List<Question> findByExerciseIdAndDifficultyLevelAndIsActiveTrueOrderByQuestionOrder(
            Long exerciseId, DifficultyLevel difficultyLevel);

    /**
     * Lấy questions theo exercise với difficulty level từ easy đến level chỉ định
     */
    @Query("SELECT q FROM Question q WHERE q.exercise.id = :exerciseId " +
           "AND q.difficultyLevel IN :levels AND q.isActive = true " +
           "ORDER BY q.difficultyLevel ASC, q.questionOrder ASC")
    List<Question> findByExerciseIdAndDifficultyLevelInOrderByDifficultyAndOrder(
            @Param("exerciseId") Long exerciseId, 
            @Param("levels") List<DifficultyLevel> levels);

    /**
     * Đếm questions theo difficulty level trong exercise
     */
    @Query("SELECT q.difficultyLevel, COUNT(q) FROM Question q " +
           "WHERE q.exercise.id = :exerciseId AND q.isActive = true " +
           "GROUP BY q.difficultyLevel")
    List<Object[]> countByExerciseIdAndDifficultyLevel(@Param("exerciseId") Long exerciseId);
}
