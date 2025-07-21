package com.leenglish.toeic.controller;

import com.leenglish.toeic.domain.*;
import com.leenglish.toeic.repository.*;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.enums.MembershipType;
import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SubmitController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TestRepository testRepo;
    @Autowired
    private UserResultRepository resultRepo;
    @Autowired
    private UserAnswerRepository answerRepo;
    @Autowired
    private QuestionTestRepository questionRepo;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(@RequestBody Map<String, Object> payload) {
        Long userId = getCurrentUserId(); // Use current authenticated user
        Long testId = Long.valueOf(payload.get("testId").toString());
        List<Map<String, Object>> answers = (List<Map<String, Object>>) payload.get("answers");

        User user = userRepo.findById(userId).orElse(null);
        Test test = testRepo.findById(testId).orElse(null);

        System.out.println("Submitting test for userId: " + userId + ", testId: " + testId);
        if (user != null) {
            System.out.println("Found user: " + user.getUsername() + " (ID: " + user.getId() + ")");
        } else {
            System.out.println("User not found for ID: " + userId);
        }

        if (user == null || test == null) {
            return ResponseEntity.badRequest().build();
        }

        UserResult result = new UserResult();
        result.setUser(user);
        result.setTest(test);
        result.setStartedAt(Timestamp.valueOf(LocalDateTime.now()));

        int correctCount = 0;
        for (Map<String, Object> a : answers) {
            Long qid = Long.valueOf(a.get("questionId").toString());
            String selected = a.get("selectedOption").toString();

            QuestionTest q = questionRepo.findById(qid).orElse(null);
            if (q == null) {
                continue;
            }

            if (selected.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
            }
        }

        // TOEIC scoring can be adjusted later
        result.setScoreListen(correctCount * 5); // example
        result.setScoreRead(0); // you may calculate separately
        result.setFinishedAt(Timestamp.valueOf(LocalDateTime.now()));
        resultRepo.save(result);

        for (Map<String, Object> a : answers) {
            Long qid = Long.valueOf(a.get("questionId").toString());
            String selected = a.get("selectedOption").toString();
            QuestionTest q = questionRepo.findById(qid).orElse(null);
            if (q == null) {
                continue;
            }

            UserAnswer ua = new UserAnswer();
            ua.setQuestion(q);
            ua.setSelectedOption(selected);
            ua.setCorrectOption(q.getCorrectOption()); // ✅ Lưu đáp án đúng
            ua.setIsCorrect(selected.equalsIgnoreCase(q.getCorrectOption())); // ✅ Tính toán isCorrect
            ua.setPartNumber(q.getPartNumber()); // ✅ Lưu part number
            ua.setResult(result);
            answerRepo.save(ua);
        }

        return ResponseEntity.ok(Map.of("score", result.getScoreListen()));
    }

    @GetMapping("/submit/result/{resultId}")
    public ResponseEntity<?> getTestReview(@PathVariable Long resultId) {
        UserResult result = resultRepo.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        List<UserAnswer> answers = answerRepo.findByResult(result);

        List<Map<String, Object>> questionDetails = answers.stream().map(answer -> {
            QuestionTest q = answer.getQuestion();
            Map<String, Object> questionData = new HashMap<>();
            questionData.put("id", q.getQuestionId());
            questionData.put("part", q.getPartNumber());
            questionData.put("questionText", q.getQuestionText());
            questionData.put("imageUrl", q.getImageUrl());
            questionData.put("audioUrl", q.getAudioUrl());
            questionData.put("correctOption", q.getCorrectOption());
            questionData.put("userOption", answer.getSelectedOption());

            List<Map<String, String>> options = q.getOptions().stream().map(opt -> {
                Map<String, String> o = new HashMap<>();
                o.put("label", opt.getLabel());
                o.put("text", opt.getContent()); 
                return o;
            }).collect(Collectors.toList());
            questionData.put("options", options);

            return questionData;
        }).toList();

        Map<String, Object> response = Map.of(
                "testTitle", result.getTest().getTitle(),
                "user", result.getUser().getUsername(), 
                "scoreListen", result.getScoreListen(),
                "scoreRead", result.getScoreRead(),
                "questions", questionDetails
        );

        return ResponseEntity.ok(response);
    }

    // Add endpoint to match frontend expectation: POST /api/tests/{testId}/review
    @PostMapping("/tests/{testId}/review")
    public ResponseEntity<?> submitTestForReview(@PathVariable Long testId, @RequestBody Map<String, Object> payload) {
        try {
            // Extract data from payload
            List<Map<String, Object>> answers = (List<Map<String, Object>>) payload.get("answers");
            if (answers == null || answers.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "No answers provided"));
            }
            
            // Get current authenticated user
            Long userId = getCurrentUserId();
            System.out.println("Processing test submission for user ID: " + userId);
            
            // Find or create default user
            User user = userRepo.findById(userId).orElse(null);
            if (user == null) {
                // Create default user for testing
                user = new User();
                user.setUsername("anonymous");
                user.setEmail("anonymous@test.com");
                user.setPasswordHash("test");
                user.setFullName("Anonymous User");
                user.setIsActive(true);
                user.setRole(Role.USER);
                user.setMembershipType(MembershipType.BASIC);
                user.setCreatedAt(LocalDateTime.now());
                user = userRepo.save(user);
            }
            
            Test test = testRepo.findById(testId).orElse(null);
            if (test == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Test not found"));
            }

            // Create result record
            UserResult result = new UserResult();
            result.setUser(user);
            result.setTest(test);
            result.setStartedAt(Timestamp.valueOf(LocalDateTime.now()));

            // Calculate score
            int correctCount = 0;
            for (Map<String, Object> a : answers) {
                Long qid = Long.valueOf(a.get("questionId").toString());
                String selected = a.get("selectedOption").toString();

                QuestionTest q = questionRepo.findById(qid).orElse(null);
                if (q == null) {
                    continue;
                }

                if (selected.equalsIgnoreCase(q.getCorrectOption())) {
                    correctCount++;
                }
            }

            // TOEIC scoring calculation
            result.setScoreListen(correctCount * 5); 
            result.setScoreRead(0);
            result.setFinishedAt(Timestamp.valueOf(LocalDateTime.now()));
            result = resultRepo.save(result);

            // Save user answers
            List<UserAnswer> userAnswers = new ArrayList<>();
            for (Map<String, Object> a : answers) {
                Long qid = Long.valueOf(a.get("questionId").toString());
                String selected = a.get("selectedOption").toString();
                QuestionTest q = questionRepo.findById(qid).orElse(null);
                if (q == null) {
                    continue;
                }

                UserAnswer ua = new UserAnswer();
                ua.setQuestion(q);
                ua.setSelectedOption(selected);
                ua.setCorrectOption(q.getCorrectOption()); // ✅ Lưu đáp án đúng
                ua.setIsCorrect(selected.equalsIgnoreCase(q.getCorrectOption())); // ✅ Tính toán isCorrect
                ua.setPartNumber(q.getPartNumber()); // ✅ Lưu part number
                ua.setResult(result);
                userAnswers.add(answerRepo.save(ua));
            }

            // Create detailed review response matching TestReviewResult structure
            Map<String, Object> testResult = Map.of(
                "resultId", result.getResultId(),
                "testTitle", result.getTest().getTitle(),
                "user", result.getUser().getUsername(), 
                "scoreListen", result.getScoreListen(),
                "scoreRead", result.getScoreRead(),
                "totalQuestions", answers.size(),
                "correctAnswers", correctCount
            );

            List<Map<String, Object>> questionReviews = userAnswers.stream().map(answer -> {
                QuestionTest q = answer.getQuestion();
                Map<String, Object> questionReview = new HashMap<>();
                questionReview.put("questionId", q.getQuestionId());
                questionReview.put("questionText", q.getQuestionText());
                questionReview.put("userAnswer", answer.getSelectedOption());
                questionReview.put("correctAnswer", q.getCorrectOption());
                questionReview.put("isCorrect", answer.getSelectedOption().equalsIgnoreCase(q.getCorrectOption()));
                questionReview.put("partNumber", q.getPartNumber());

                List<Map<String, String>> options = q.getOptions().stream().map(opt -> {
                    Map<String, String> option = new HashMap<>();
                    option.put("optionId", opt.getOptionId().toString());
                    option.put("label", opt.getLabel());
                    option.put("content", opt.getContent());
                    return option;
                }).collect(Collectors.toList());
                questionReview.put("options", options);

                return questionReview;
            }).collect(Collectors.toList());

            Map<String, Object> response = Map.of(
                "testResult", testResult,
                "questionReviews", questionReviews
            );

            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }

    // Helper method to get current user ID
    private Long getCurrentUserId() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("Authentication object: " + authentication);
            
            if (authentication != null) {
                System.out.println("Authentication name: " + authentication.getName());
                System.out.println("Authentication principal: " + authentication.getPrincipal());
                System.out.println("Is authenticated: " + authentication.isAuthenticated());
                
                if (authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
                    // Try to get user from database by username
                    String username = authentication.getName();
                    System.out.println("Looking for user with username: " + username);
                    
                    User user = userRepo.findByUsernameOrEmail(username, username).orElse(null);
                    if (user != null) {
                        System.out.println("Found authenticated user: " + user.getUsername() + " (ID: " + user.getId() + ")");
                        return user.getId();
                    } else {
                        System.out.println("User not found in database for username: " + username);
                    }
                } else {
                    System.out.println("User is not authenticated or is anonymous");
                }
            } else {
                System.out.println("No authentication context found");
            }
        } catch (Exception e) {
            System.err.println("Error getting current user: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("Falling back to default user ID: 1");
        // Fallback to default user ID 1 for anonymous/testing
        return 1L;
    }
}
