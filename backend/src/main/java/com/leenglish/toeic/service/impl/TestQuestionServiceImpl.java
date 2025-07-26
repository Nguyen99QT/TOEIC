package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.dto.QuestionWithOptions;
import com.leenglish.toeic.domain.Test;
import com.leenglish.toeic.domain.TestQuestion;
import com.leenglish.toeic.domain.QuestionTest;
import com.leenglish.toeic.domain.Option;
import com.leenglish.toeic.repository.TestRepository;
import com.leenglish.toeic.repository.TestQuestionRepository;
import com.leenglish.toeic.service.TestQuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestQuestionServiceImpl implements TestQuestionService {
    
    @Autowired
    private TestRepository testRepository;
    
    @Autowired
    private TestQuestionRepository testQuestionRepository;
    
    @Override
    public List<QuestionWithOptions> getTestQuestions(Long testId, Integer partNumber) {
        System.out.println("=== DEBUG: getTestQuestions called with testId=" + testId + ", partNumber=" + partNumber);
        
        Test test = testRepository.findById(testId)
            .orElseThrow(() -> new RuntimeException("Test not found with id: " + testId));
        
        System.out.println("=== DEBUG: Found test: " + test.getTitle());
        
        // Use repository to get test questions directly instead of lazy loading
        List<TestQuestion> testQuestions = testQuestionRepository.findByTest(test);
        System.out.println("=== DEBUG: Found " + testQuestions.size() + " test questions");
        
        try {
            return testQuestions.stream()
                .map(TestQuestion::getQuestion)
                .filter(question -> {
                    System.out.println("=== DEBUG: Processing question " + question.getQuestionId() + " from part " + question.getPartNumber());
                    return partNumber == null || question.getPartNumber().equals(partNumber);
                })
                .map(this::convertToQuestionWithOptions)
                .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("=== DEBUG: Error processing questions: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private QuestionWithOptions convertToQuestionWithOptions(QuestionTest question) {
        QuestionWithOptions dto = new QuestionWithOptions();
        dto.setQuestionId(question.getQuestionId());
        dto.setQuestionText(question.getQuestionText());
        dto.setAudioUrl(question.getAudioUrl());
        dto.setImageUrl(question.getImageUrl());
        
        // Include content from QuestionGroup for Parts 6 & 7 (reading passages)
        if (question.getGroup() != null && question.getGroup().getContent() != null) {
            dto.setContent(question.getGroup().getContent());
        }
        
        List<QuestionWithOptions.OptionDTO> optionDTOs = question.getOptions().stream()
            .map(this::convertToOptionDTO)
            .collect(Collectors.toList());
        dto.setOptions(optionDTOs);
        
        return dto;
    }
    
    private QuestionWithOptions.OptionDTO convertToOptionDTO(Option option) {
        QuestionWithOptions.OptionDTO dto = new QuestionWithOptions.OptionDTO();
        dto.setOptionId(option.getOptionId());
        dto.setLabel(option.getLabel());
        dto.setContent(option.getContent());
        return dto;
    }
}
