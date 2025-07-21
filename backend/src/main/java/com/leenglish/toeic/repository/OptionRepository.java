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

import com.leenglish.toeic.domain.Option;
import com.leenglish.toeic.domain.QuestionTest;

/**
 *
 * @author caong
 */
@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestion(QuestionTest question);
    
    /**
     * Tìm các options theo question ID, sắp xếp theo label
     */
    @Query("SELECT o FROM Option o WHERE o.question.questionId = :questionId ORDER BY o.label")
    List<Option> findByQuestionQuestionIdOrderByLabel(@Param("questionId") Long questionId);
    
    /**
     * Tìm các options theo question, sắp xếp theo label
     */
    @Query("SELECT o FROM Option o WHERE o.question = :question ORDER BY o.label")
    List<Option> findByQuestionOrderByLabel(@Param("question") QuestionTest question);
}
