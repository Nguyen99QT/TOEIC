/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.leenglish.toeic.domain.QuestionTest;

/**
 *
 * @author caong
 */
public interface QuestionTestRepository extends JpaRepository<QuestionTest, Long>{
     List<QuestionTest> findByPartNumber(Integer partNumber);

    @Query("SELECT q FROM QuestionTest q WHERE q.partNumber = :partNumber ORDER BY FUNCTION('RAND')")
    List<QuestionTest> findRandomByPartNumber(@Param("partNumber") Integer partNumber, Pageable pageable);
    
    @Query("SELECT q.questionId, q.questionText, q.imageUrl, q.audioUrl, q.correctOption, q.questionOrder, q.partNumber FROM QuestionTest q")
    List<Object[]> findAllQuestionData();
    
    @Query("SELECT q.questionId, q.questionText, q.imageUrl, q.audioUrl, q.correctOption, q.questionOrder, q.partNumber FROM QuestionTest q WHERE q.partNumber = :partNumber")
    List<Object[]> findQuestionDataByPartNumber(@Param("partNumber") Integer partNumber);
    
    @Query("SELECT q.questionId, q.questionText, q.imageUrl, q.audioUrl, q.correctOption, q.questionOrder, q.partNumber FROM QuestionTest q WHERE q.createdBy.id = :userId")
    List<Object[]> findQuestionDataByCreatedBy(@Param("userId") Long userId);
    
    // For deleting questions by group
    void deleteByGroup(com.leenglish.toeic.domain.QuestionGroup group);
}
