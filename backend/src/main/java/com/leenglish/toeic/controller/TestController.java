package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.RandomTestRequest;
import com.leenglish.toeic.dto.TestSelectionResponse;
import com.leenglish.toeic.dto.TestDetailsResponse;
import com.leenglish.toeic.dto.TestPartResponse;
import com.leenglish.toeic.service.TestGenerationService;
import com.leenglish.toeic.repository.TestRepository;
import com.leenglish.toeic.repository.TestQuestionRepository;
import com.leenglish.toeic.domain.Test;
import com.leenglish.toeic.domain.TestQuestion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TestController {

    @Autowired
    private TestGenerationService testGenerationService;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private TestQuestionRepository testQuestionRepository;

    @GetMapping("/selection/available")
    public ResponseEntity<List<TestSelectionResponse>> getAvailableTests() {
        try {
            List<TestSelectionResponse> availableTests = testGenerationService.getAvailableTests();
            return ResponseEntity.ok(availableTests);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/selection/generate-random")
    public ResponseEntity<TestSelectionResponse> generateRandomTest(@Valid @RequestBody RandomTestRequest request) {
        try {
            TestSelectionResponse response = testGenerationService.generateRandomTest(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/selection/generate-quick")
    public ResponseEntity<TestSelectionResponse> generateQuickRandomTest() {
        try {
            TestSelectionResponse response = testGenerationService.generateQuickRandomTest();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ========== TEST DATA ENDPOINTS ==========

    @GetMapping("/{testId}")
    public ResponseEntity<TestDetailsResponse> getTestById(@PathVariable Long testId) {
        try {
            Optional<Test> testOpt = testRepository.findById(testId);
            if (testOpt.isPresent()) {
                Test test = testOpt.get();
                TestDetailsResponse response = new TestDetailsResponse(
                    test.getTestId(),
                    test.getTitle(),
                    test.getDescription(),
                    test.getCreatedAt(),
                    test.getCreatedBy() != null ? test.getCreatedBy().getUsername() : "System"
                );
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{testId}/parts")
    public ResponseEntity<List<TestPartResponse>> getTestParts(@PathVariable Long testId) {
        try {
            List<TestQuestion> testQuestions = testQuestionRepository.findByTestIdWithQuestionAndOptions(testId);
            
            if (testQuestions.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            List<TestPartResponse> response = testQuestions.stream().map(tq -> {
                TestPartResponse part = new TestPartResponse();
                part.setQuestionId(tq.getQuestion().getQuestionId());
                part.setPartNumber(tq.getPartNumber());
                part.setQuestionOrder(tq.getQuestionOrder());
                part.setQuestionText(tq.getQuestion().getQuestionText());
                part.setAudioUrl(tq.getQuestion().getAudioUrl());
                part.setImageUrl(tq.getQuestion().getImageUrl());
                
                // Set options from the question
                if (tq.getQuestion().getOptions() != null && !tq.getQuestion().getOptions().isEmpty()) {
                    var options = tq.getQuestion().getOptions();
                    for (var option : options) {
                        if (option.getLabel() != null && option.getContent() != null) {
                            switch (option.getLabel()) {
                                case "A": part.setOptionA(option.getContent()); break;
                                case "B": part.setOptionB(option.getContent()); break;
                                case "C": part.setOptionC(option.getContent()); break;
                                case "D": part.setOptionD(option.getContent()); break;
                            }
                        }
                    }
                }
                
                part.setCorrectAnswer(tq.getQuestion().getCorrectOption());
                return part;
            }).collect(java.util.stream.Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
