package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.UserExerciseAttempt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserExerciseAttemptRepository extends JpaRepository<UserExerciseAttempt, Long> {

    // ========== BASIC METHODS ONLY ==========

    List<UserExerciseAttempt> findByUserId(Long userId);

    Page<UserExerciseAttempt> findByUserId(Long userId, Pageable pageable);

    List<UserExerciseAttempt> findByExerciseId(Long exerciseId);

    List<UserExerciseAttempt> findByUserIdAndExerciseId(Long userId, Long exerciseId);

    long countByUserId(Long userId);

    long countByExerciseId(Long exerciseId);
}
