/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.dto.*;
import com.leenglish.toeic.domain.*;
import com.leenglish.toeic.repository.*;
import com.leenglish.toeic.service.QuestionBankService;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class QuestionBankServiceImpl implements QuestionBankService {

    private static final Logger logger = LoggerFactory.getLogger(QuestionBankServiceImpl.class);

    private final QuestionTestRepository questionRepo;
    private final OptionRepository optionRepo;

    public QuestionBankServiceImpl(QuestionTestRepository questionRepo, OptionRepository optionRepo) {
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
    }

    @Override
    public void addQuestionToBank(QuestionCreateRequest req, User createdBy) {
        try {
            logger.info("🔥 Starting to save question - Part {}, Text: {}, CreatedBy: {}", 
                req.partNumber(), req.questionText(), createdBy.getUsername());
            
            QuestionTest q = new QuestionTest();
            q.setPartNumber(req.partNumber());
            q.setQuestionText(req.questionText());
            q.setAudioUrl(req.audioUrl());
            q.setImageUrl(req.imageUrl());
            q.setCorrectOption(req.correctOptionLabel());
            q.setCreatedBy(createdBy);  // ✅ Set creator
            
            logger.info("💾 Saving QuestionTest entity...");
            QuestionTest savedQuestion = questionRepo.save(q);
            logger.info("✅ QuestionTest saved with ID: {}", savedQuestion.getQuestionId());

            logger.info("📝 Saving {} options...", req.options().size());
            for (OptionCreateDTO o : req.options()) {
                Option opt = new Option();
                opt.setQuestion(savedQuestion);
                opt.setLabel(o.label());
                opt.setContent(o.content());
                
                Option savedOption = optionRepo.save(opt);
                logger.info("✅ Option saved - ID: {}, Label: {}, Content: {}", 
                    savedOption.getOptionId(), savedOption.getLabel(), savedOption.getContent());
            }
            
            logger.info("🎉 Successfully saved question and all options!");
            
        } catch (Exception e) {
            logger.error("❌ Error saving question: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @Override
    public void addQuestionToBank(QuestionCreateRequest req) {
        // For system-generated questions, use null createdBy (system questions)
        addQuestionToBank(req, null);
    }
    
    @Override
    public List<QuestionTest> findByPartNumber(Integer partNumber) {
        try {
            List<QuestionTest> questions;
            if (partNumber == null) {
                questions = questionRepo.findAll();
            } else {
                questions = questionRepo.findByPartNumber(partNumber);
            }
            
            return questions;
        } catch (Exception e) {
            logger.error("❌ Error fetching questions: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @Override
    public List<QuestionBankListDto> getQuestionList(Integer partNumber) {
        try {
            List<Object[]> questionData;
            if (partNumber == null) {
                questionData = questionRepo.findAllQuestionData();
            } else {
                questionData = questionRepo.findQuestionDataByPartNumber(partNumber);
            }
            
            // Convert Object[] to DTO
            return questionData.stream()
                    .map(row -> new QuestionBankListDto(
                            (Long) row[0],      // questionId
                            (String) row[1],    // questionText
                            (String) row[2],    // imageUrl
                            (String) row[3],    // audioUrl
                            (String) row[4],    // correctOption
                            (Integer) row[5],   // questionOrder
                            (Integer) row[6]    // partNumber
                    ))
                    .toList();
        } catch (Exception e) {
            logger.error("❌ Error fetching question list: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @Override
    public List<QuestionBankListDto> getMyQuestions(User user) {
        try {
            List<Object[]> questionData = questionRepo.findQuestionDataByCreatedBy(user.getId());
            
            return questionData.stream()
                    .map(row -> new QuestionBankListDto(
                            (Long) row[0],      // questionId
                            (String) row[1],    // questionText
                            (String) row[2],    // imageUrl
                            (String) row[3],    // audioUrl
                            (String) row[4],    // correctOption
                            (Integer) row[5],   // questionOrder
                            (Integer) row[6]    // partNumber
                    ))
                    .toList();
        } catch (Exception e) {
            logger.error("❌ Error fetching my questions: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public QuestionDetailDto getQuestionByQuestionId(Long id) {
        try {
            QuestionTest q = questionRepo.findById(id).orElse(null);
            if (q == null) return null;
            // Lấy danh sách option
            List<Option> options = optionRepo.findByQuestion(q);
            List<OptionDto> optionDtos = options.stream()
                .map(opt -> new OptionDto(opt.getOptionId(), opt.getLabel(), opt.getContent()))
                .collect(Collectors.toList());
            return new QuestionDetailDto(
                q.getQuestionId(),
                q.getQuestionText(),
                q.getImageUrl(),
                q.getAudioUrl(),
                q.getCorrectOption(),
                q.getQuestionOrder(),
                q.getPartNumber(),
                optionDtos
            );
        } catch (Exception e) {
            logger.error("❌ Error fetching question by id: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void updateQuestion(Long id, QuestionCreateRequest request, User updatedBy) {
        try {
            QuestionTest question = questionRepo.findById(id).orElse(null);
            if (question == null) {
                throw new RuntimeException("Question not found");
            }
            // Kiểm tra quyền sở hữu
            if (updatedBy != null && question.getCreatedBy() != null && !question.getCreatedBy().getId().equals(updatedBy.getId())) {
                throw new RuntimeException("You do not have permission to edit this question");
            }
            // Cập nhật nội dung
            question.setQuestionText(request.questionText());
            question.setPartNumber(request.partNumber());
            question.setAudioUrl(request.audioUrl());
            question.setImageUrl(request.imageUrl());
            question.setCorrectOption(request.correctOptionLabel());
            // Clear collection to avoid Hibernate orphan merge error
            if (question.getOptions() != null) {
                question.getOptions().clear();
            }
            // Xóa các option cũ
            List<Option> oldOptions = optionRepo.findByQuestion(question);
            for (Option opt : oldOptions) {
                optionRepo.delete(opt);
            }
            // Thêm option mới
            List<Option> newOptions = new java.util.ArrayList<>();
            for (OptionCreateDTO o : request.options()) {
                Option opt = new Option();
                opt.setQuestion(question);
                opt.setLabel(o.label());
                opt.setContent(o.content());
                optionRepo.save(opt);
                newOptions.add(opt);
            }
            question.setOptions(newOptions);
            questionRepo.save(question);
            logger.info("✅ Updated question {} and its options", id);
        } catch (Exception e) {
            logger.error("❌ Error updating question: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public void deleteQuestion(Long id, User deletedBy) {
        try {
            QuestionTest question = questionRepo.findById(id).orElse(null);
            if (question == null) {
                throw new RuntimeException("Question not found");
            }
            // Kiểm tra quyền sở hữu
            if (deletedBy != null && question.getCreatedBy() != null && !question.getCreatedBy().getId().equals(deletedBy.getId())) {
                throw new RuntimeException("You do not have permission to delete this question");
            }
            // Xóa các option liên quan
            List<Option> options = optionRepo.findByQuestion(question);
            for (Option opt : options) {
                optionRepo.delete(opt);
            }
            // Xóa câu hỏi
            questionRepo.delete(question);
            logger.info("✅ Deleted question {} and its options", id);
        } catch (Exception e) {
            logger.error("❌ Error deleting question: {}", e.getMessage(), e);
            throw e;
        }
    }
}
