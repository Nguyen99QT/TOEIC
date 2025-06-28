/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.service.impl;

import aptech.fpt.toeic_backend.dto.TestGenerateRequest;
import aptech.fpt.toeic_backend.model.*;
import aptech.fpt.toeic_backend.repository.*;
import aptech.fpt.toeic_backend.service.TestGenerationService;
import java.sql.Timestamp;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@Transactional
public class TestGenerationServiceImpl implements TestGenerationService {

    private final TestRepository testRepo;
    private final QuestionRepository questionRepo;
    private final TestQuestionRepository testQuestionRepo;
    private final UserRepository userRepository;

    public TestGenerationServiceImpl(TestRepository testRepo, QuestionRepository questionRepo, TestQuestionRepository testQuestionRepo, UserRepository userRepository) {
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

            List<Question> questions = questionRepo.findRandomByPartNumber(part, count);

            for (int i = 0; i < questions.size(); i++) {
                Question q = questions.get(i);
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
}
