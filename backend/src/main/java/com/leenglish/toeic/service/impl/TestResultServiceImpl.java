package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.dto.TestSubmissionRequest;
import com.leenglish.toeic.dto.TestResult;
import com.leenglish.toeic.domain.Test;
import com.leenglish.toeic.domain.QuestionTest;
import com.leenglish.toeic.domain.UserResult;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.domain.UserAnswer;
import com.leenglish.toeic.repository.TestRepository;
import com.leenglish.toeic.repository.UserResultRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.repository.UserAnswerRepository;
import com.leenglish.toeic.service.TestResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class TestResultServiceImpl implements TestResultService {
    
    @Autowired
    private TestRepository testRepository;
    
    @Autowired
    private UserResultRepository userResultRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Override
    public TestResult calculateResult(Long testId, TestSubmissionRequest request) {
        Test test = testRepository.findById(testId)
            .orElseThrow(() -> new RuntimeException("Test not found with id: " + testId));
        
        List<TestSubmissionRequest.AnswerSubmission> userAnswers = request.getAnswers();
        int totalQuestions = test.getTestQuestions().size();
        int correctAnswers = 0;
        
        // Create a map for quick lookup
        Map<Long, String> answerMap = userAnswers.stream()
            .collect(Collectors.toMap(
                TestSubmissionRequest.AnswerSubmission::getQuestionId,
                TestSubmissionRequest.AnswerSubmission::getSelectedOption
            ));
        
        // Lists to store detailed answers for database
        List<UserAnswer> detailedAnswers = new ArrayList<>();
        int listeningCorrect = 0, readingCorrect = 0;
        
        // Calculate correct answers and prepare detailed answer records
        for (var testQuestion : test.getTestQuestions()) {
            QuestionTest question = testQuestion.getQuestion();
            String userAnswer = answerMap.get(question.getQuestionId());
            String correctOption = question.getCorrectOption();
            boolean isCorrect = userAnswer != null && userAnswer.equals(correctOption);
            
            if (isCorrect) {
                correctAnswers++;
                // Count by part for TOEIC scoring
                if (testQuestion.getPartNumber() <= 4) {
                    listeningCorrect++;
                } else {
                    readingCorrect++;
                }
            }
            
            // Create detailed answer record (will be saved after UserResult is created)
            UserAnswer answer = new UserAnswer();
            answer.setQuestion(question);
            answer.setSelectedOption(userAnswer);
            answer.setCorrectOption(correctOption);
            answer.setIsCorrect(isCorrect);
            answer.setPartNumber(testQuestion.getPartNumber());
            answer.setAnsweredAt(LocalDateTime.now());
            detailedAnswers.add(answer);
        }
        
        // Calculate score and percentage
        double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0;
        int score = (int) (percentage * 9.9); // Scale to TOEIC-like score (0-990)
        
        // Save result to database
        try {
            UserResult userResult = new UserResult();
            userResult.setTest(test);
            
            // For now, use a default user (ID = 1). In production, get from JWT token
            User user = userRepository.findById(1L).orElse(null);
            if (user != null) {
                userResult.setUser(user);
            }
            
            // Calculate TOEIC-style scores for listening and reading
            int listeningScore = Math.min(495, (int) (((double) listeningCorrect / (totalQuestions * 0.5)) * 495));
            int readingScore = Math.min(495, (int) (((double) readingCorrect / (totalQuestions * 0.5)) * 495));
            
            userResult.setScoreListen(listeningScore);
            userResult.setScoreRead(readingScore);
            userResult.setStartedAt(Timestamp.valueOf(LocalDateTime.now().minusHours(2))); // Assume 2-hour test
            userResult.setFinishedAt(Timestamp.valueOf(LocalDateTime.now()));
            
            // Save to database
            userResult = userResultRepository.save(userResult);
            System.out.println("=== RESULT SAVED: Test result saved to database with ID: " + userResult.getResultId());
            System.out.println("=== RESULT DETAILS: Total Score: " + (listeningScore + readingScore) + ", Listening: " + listeningScore + ", Reading: " + readingScore);
            
            // Now save detailed answers with the UserResult reference
            for (UserAnswer answer : detailedAnswers) {
                answer.setResult(userResult);
            }
            userAnswerRepository.saveAll(detailedAnswers);
            System.out.println("=== ANSWERS SAVED: " + detailedAnswers.size() + " detailed answers saved to database");
            
        } catch (Exception e) {
            System.err.println("=== ERROR SAVING RESULT: " + e.getMessage());
            e.printStackTrace();
        }
        
        TestResult result = new TestResult();
        result.setTestId(testId);
        result.setTotalQuestions(totalQuestions);
        result.setCorrectAnswers(correctAnswers);
        result.setPercentage(percentage);
        result.setScore(score);
        
        return result;
    }
}
