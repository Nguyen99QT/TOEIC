/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.QuestionTest;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.QuestionCreateRequest;
import com.leenglish.toeic.dto.QuestionBankListDto;
import com.leenglish.toeic.dto.QuestionDetailDto;

/**
 *
 * @author caong
 */
@Transactional
public interface QuestionBankService {
    void addQuestionToBank(QuestionCreateRequest request, User createdBy);
    void addQuestionToBank(QuestionCreateRequest request); // For system-generated questions
    List<QuestionTest> findByPartNumber(Integer partNumber);
    List<QuestionBankListDto> getQuestionList(Integer partNumber);
    List<QuestionBankListDto> getMyQuestions(User user);
    QuestionDetailDto getQuestionByQuestionId(Long id);
    void updateQuestion(Long id, QuestionCreateRequest request, User updatedBy);
    void deleteQuestion(Long id, User deletedBy);
}
