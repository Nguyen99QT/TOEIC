/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserAnswer;
import com.leenglish.toeic.domain.UserResult;

/**
 *
 * @author caong
 */
@Repository
public interface UserAnswerRepository extends JpaRepository<UserAnswer, Long> {
    
    /**
     * Tìm tất cả câu trả lời theo result
     */
    List<UserAnswer> findByResult(UserResult result);
    
    /**
     * Tìm tất cả câu trả lời theo result ID
     */
    @Query("SELECT ua FROM UserAnswer ua JOIN FETCH ua.question WHERE ua.result.resultId = :resultId ORDER BY ua.question.questionId")
    List<UserAnswer> findByResultId(@Param("resultId") Long resultId);
    
    /**
     * Tìm câu trả lời theo result ID và part number
     */
    @Query("SELECT ua FROM UserAnswer ua WHERE ua.result.resultId = :resultId AND ua.partNumber = :partNumber ORDER BY ua.question.questionId")
    List<UserAnswer> findByResultIdAndPartNumber(@Param("resultId") Long resultId, @Param("partNumber") Integer partNumber);
    
    /**
     * Đếm số câu đúng theo result ID
     */
    @Query("SELECT COUNT(ua) FROM UserAnswer ua WHERE ua.result.resultId = :resultId AND ua.isCorrect = true")
    Long countCorrectAnswersByResultId(@Param("resultId") Long resultId);
    
    /**
     * Đếm số câu đúng theo result ID và part number
     */
    @Query("SELECT COUNT(ua) FROM UserAnswer ua WHERE ua.result.resultId = :resultId AND ua.partNumber = :partNumber AND ua.isCorrect = true")
    Long countCorrectAnswersByResultIdAndPart(@Param("resultId") Long resultId, @Param("partNumber") Integer partNumber);
    
    /**
     * Debug query để test UserAnswer
     */
    @Query(value = "SELECT COUNT(*) FROM user_answers WHERE result_id = :resultId", nativeQuery = true)
    Long debugCountByResultId(@Param("resultId") Long resultId);
    
    /**
     * Update UserAnswer với correct_option từ question_test
     */
    @Query(value = """
        UPDATE user_answers ua 
        JOIN question_test qt ON ua.question_id = qt.question_id 
        SET ua.correct_option = qt.correct_option,
            ua.is_correct = (ua.selected_option = qt.correct_option)
        WHERE ua.result_id = :resultId
    """, nativeQuery = true)
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    int updateCorrectAnswersForResult(@Param("resultId") Long resultId);
    
    /**
     * Get UserAnswer với question correct_option
     */
    @Query(value = """
        SELECT ua.*, qt.correct_option as question_correct_option
        FROM user_answers ua 
        JOIN question_test qt ON ua.question_id = qt.question_id 
        WHERE ua.result_id = :resultId 
        ORDER BY ua.question_id
    """, nativeQuery = true)
    List<Object[]> findByResultIdWithQuestionCorrectOption(@Param("resultId") Long resultId);
}
