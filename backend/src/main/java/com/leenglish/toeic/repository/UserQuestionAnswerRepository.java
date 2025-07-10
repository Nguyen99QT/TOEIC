package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserQuestionAnswer;

@Repository
public interface UserQuestionAnswerRepository extends JpaRepository<UserQuestionAnswer, Long> {

    List<UserQuestionAnswer> findByResultId(Long resultId);

    List<UserQuestionAnswer> findByQuestionId(Long questionId);
}
