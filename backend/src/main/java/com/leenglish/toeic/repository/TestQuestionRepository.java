package com.leenglish.toeic.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leenglish.toeic.domain.Test;
import com.leenglish.toeic.domain.TestQuestion;

/**
 *
 * @author caong
 */
public interface TestQuestionRepository extends JpaRepository<TestQuestion, Long> {
    List<TestQuestion> findByTest(Test test);
    
    @Query("SELECT tq FROM TestQuestion tq JOIN FETCH tq.question q LEFT JOIN FETCH q.options WHERE tq.test.testId = :testId ORDER BY tq.questionOrder")
    List<TestQuestion> findByTestIdWithQuestionAndOptions(@Param("testId") Long testId);
}
