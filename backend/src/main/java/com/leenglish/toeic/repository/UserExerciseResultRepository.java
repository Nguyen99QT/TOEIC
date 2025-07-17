package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserExerciseResult;

@Repository
public interface UserExerciseResultRepository extends JpaRepository<UserExerciseResult, Long> {

    List<UserExerciseResult> findByUserIdAndExerciseId(Long userId, Long exerciseId);

    List<UserExerciseResult> findByExerciseId(Long exerciseId);

    List<UserExerciseResult> findByUserId(Long userId);

    /**
     * Check if user has completed an exercise
     */
    boolean existsByUserIdAndExerciseId(Long userId, Long exerciseId);

    /**
     * Get all completed exercise IDs for a user
     */
    @Query("SELECT DISTINCT uer.exercise.id FROM UserExerciseResult uer WHERE uer.user.id = :userId")
    List<Long> findCompletedExerciseIdsByUserId(@Param("userId") Long userId);
}
