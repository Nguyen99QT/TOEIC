package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserFeedback;

@Repository
public interface UserFeedbackRepository extends JpaRepository<UserFeedback, Long> {

    List<UserFeedback> findByUserIdAndExerciseId(Long userId, Long exerciseId);

    List<UserFeedback> findByExerciseId(Long exerciseId);

    List<UserFeedback> findByUserId(Long userId);
}
