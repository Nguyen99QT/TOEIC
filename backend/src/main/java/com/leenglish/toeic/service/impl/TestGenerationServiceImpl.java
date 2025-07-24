/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.dto.TestGenerateRequest;
import com.leenglish.toeic.dto.RandomTestRequest;
import com.leenglish.toeic.dto.TestSelectionResponse;
import com.leenglish.toeic.domain.*;
import com.leenglish.toeic.repository.*;
import com.leenglish.toeic.service.TestGenerationService;
import java.sql.Timestamp;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TestGenerationServiceImpl implements TestGenerationService {

    private final TestRepository testRepo;
    private final QuestionTestRepository questionRepo;
    private final TestQuestionRepository testQuestionRepo;
    private final UserRepository userRepository;

    public TestGenerationServiceImpl(TestRepository testRepo, QuestionTestRepository questionRepo, TestQuestionRepository testQuestionRepo, UserRepository userRepository) {
        this.testRepo = testRepo;
        this.questionRepo = questionRepo;
        this.testQuestionRepo = testQuestionRepo;
        this.userRepository = userRepository;
    }

    @Override
    public Long generateTestFromBank(TestGenerateRequest req) {

        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Test test = new Test();
        test.setTitle(req.title());
        test.setDescription(req.description());
        test.setCreatedBy(user);
        test.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        
        testRepo.save(test);

        for (Map.Entry<Integer, Integer> entry : req.partQuestionCount().entrySet()) {
            int part = entry.getKey();
            int count = entry.getValue();

            Pageable pageable = PageRequest.of(0, count);
            List<QuestionTest> questions = questionRepo.findRandomByPartNumber(part, pageable);
            
            // Log warning if not enough questions
            if (questions.size() < count) {
                System.out.println("WARNING: Part " + part + " requested " + count + " questions but only " + questions.size() + " available");
            }

            for (int i = 0; i < questions.size(); i++) {
                QuestionTest q = questions.get(i);
                TestQuestion tq = new TestQuestion();
                tq.setTest(test);
                tq.setQuestion(q);
                tq.setPartNumber(part);
                tq.setQuestionOrder(i + 1);
                testQuestionRepo.save(tq);
            }
        }

        return test.getTestId();
    }
    
    @Override
    public TestSelectionResponse generateRandomTest(RandomTestRequest request) {
        System.out.println("=== Generating random test with request: " + request);
        
        // Create test entity
        Test test = new Test();
        test.setTitle(request.title());
        test.setDescription(request.description());
        test.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        
        // For now, use system user (ID=1). In production, get from JWT
        User systemUser = userRepository.findById(1L).orElse(null);
        test.setCreatedBy(systemUser);
        
        testRepo.save(test);
        
        // Define TOEIC structure based on request
        Map<Integer, Integer> partQuestionCount = getRandomTestStructure(request.useFullTOEICStructure());
        
        System.out.println("=== Using question structure: " + partQuestionCount);
        
        int totalQuestions = 0;
        
        // Generate questions for each part
        for (Map.Entry<Integer, Integer> entry : partQuestionCount.entrySet()) {
            int part = entry.getKey();
            int count = entry.getValue();
            
            System.out.println("=== Generating " + count + " questions for part " + part);
            
            Pageable pageable = PageRequest.of(0, count);
            List<QuestionTest> questions = questionRepo.findRandomByPartNumber(part, pageable);
            
            System.out.println("=== Found " + questions.size() + " questions for part " + part);
            
            for (int i = 0; i < questions.size(); i++) {
                QuestionTest q = questions.get(i);
                TestQuestion tq = new TestQuestion();
                tq.setTest(test);
                tq.setQuestion(q);
                tq.setPartNumber(part);
                tq.setQuestionOrder(i + 1);
                testQuestionRepo.save(tq);
                totalQuestions++;
            }
        }
        
        System.out.println("=== Random test generated with ID: " + test.getTestId());
        
        // Return TestSelectionResponse
        return new TestSelectionResponse(
            test.getTestId(),
            test.getTitle(),
            test.getDescription(),
            test.getCreatedAt().toLocalDateTime(),
            totalQuestions,
            "RANDOM_GENERATED",
            true
        );
    }
    
    @Override
    public List<TestSelectionResponse> getAvailableTests() {
        List<Test> tests = testRepo.findAll();
        
        return tests.stream()
            .map(test -> {
                // Count total questions for each test
                int questionCount = testQuestionRepo.findByTest(test).size();
                
                return new TestSelectionResponse(
                    test.getTestId(),
                    test.getTitle(),
                    test.getDescription(),
                    test.getCreatedAt() != null ? test.getCreatedAt().toLocalDateTime() : null,
                    questionCount,
                    "EXISTING",
                    false
                );
            })
            .collect(Collectors.toList());
    }
    
    @Override
    public TestSelectionResponse generateQuickRandomTest() {
        RandomTestRequest quickRequest = new RandomTestRequest(
            "Quick Random TOEIC Test",
            "Quick practice test with limited questions per part",
            false
        );
        return generateRandomTest(quickRequest);
    }
    
    /**
     * Get question count structure for random test generation
     */
    private Map<Integer, Integer> getRandomTestStructure(boolean useFullStructure) {
        Map<Integer, Integer> structure = new HashMap<>();
        
        if (useFullStructure) {
            // Full TOEIC test structure (200 questions total)
            structure.put(1, 6);   // Part 1: Picture Description (6 questions)
            structure.put(2, 25);  // Part 2: Question-Response (25 questions)
            structure.put(3, 39);  // Part 3: Conversations (39 questions)
            structure.put(4, 30);  // Part 4: Talks (30 questions)
            structure.put(5, 30);  // Part 5: Incomplete Sentences (30 questions)
            structure.put(6, 16);  // Part 6: Text Completion (16 questions)
            structure.put(7, 54);  // Part 7: Reading Comprehension (54 questions)
        } else {
            // Quick test structure (reduced questions)
            structure.put(1, 3);   // Part 1: 3 questions
            structure.put(2, 5);   // Part 2: 5 questions
            structure.put(3, 6);   // Part 3: 6 questions
            structure.put(4, 6);   // Part 4: 6 questions
            structure.put(5, 10);  // Part 5: 10 questions
            structure.put(6, 5);   // Part 6: 5 questions
            structure.put(7, 10);  // Part 7: 10 questions
        }
        
        return structure;
    }
}
