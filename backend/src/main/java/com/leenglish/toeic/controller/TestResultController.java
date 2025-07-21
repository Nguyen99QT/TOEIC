package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.TestResultDetail;
import com.leenglish.toeic.domain.*;
import com.leenglish.toeic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/test-results")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class TestResultController {
    
    @Autowired
    private UserResultRepository userResultRepository;
    
    @Autowired
    private UserAnswerRepository userAnswerRepository;
    
    @Autowired
    private OptionRepository optionRepository;
    
    /**
     * Simple test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Test result controller is working!");
    }
    
    /**
     * Simple detail test
     */
    @GetMapping("/detail-debug/{resultId}")
    public ResponseEntity<String> detailDebug(@PathVariable Long resultId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("Detail debug for result: ").append(resultId).append("\n");
            
            // Test UserResult query
            UserResult result = userResultRepository.findById(resultId).orElse(null);
            if (result == null) {
                debug.append("UserResult not found!\n");
                return ResponseEntity.ok(debug.toString());
            }
            
            debug.append("Result found - ID: ").append(result.getResultId()).append("\n");
            debug.append("Total Score: ").append(result.getTotalScore()).append("\n");
            
            // Test UserAnswer query
            List<UserAnswer> answers = userAnswerRepository.findByResultId(resultId);
            debug.append("Found ").append(answers.size()).append(" answers\n");
            
            for (UserAnswer answer : answers) {
                debug.append("Answer:\n");
                debug.append("  - Selected: ").append(answer.getSelectedOption()).append("\n");
                debug.append("  - Correct: ").append(answer.getCorrectOption()).append("\n");
                debug.append("  - IsCorrect: ").append(answer.getIsCorrect()).append("\n");
                debug.append("  - Question: ").append(answer.getQuestion() != null ? answer.getQuestion().getQuestionId() : "NULL").append("\n");
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/debug/count")
    public ResponseEntity<String> debugCount() {
        try {
            long count = userResultRepository.count();
            return ResponseEntity.ok("Total results in database: " + count);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Fix user answers data
     */
    @PostMapping("/fix-user-answers")
    public ResponseEntity<String> fixUserAnswers() {
        try {
            // Get all user answers that need fixing
            List<UserAnswer> allAnswers = userAnswerRepository.findAll();
            int fixed = 0;
            
            for (UserAnswer answer : allAnswers) {
                if (answer.getIsCorrect() == null && answer.getQuestion() != null) {
                    String questionCorrectOption = answer.getQuestion().getCorrectOption();
                    String selectedOption = answer.getSelectedOption();
                    
                    if (questionCorrectOption != null) {
                        boolean isCorrect = questionCorrectOption.equals(selectedOption);
                        answer.setIsCorrect(isCorrect);
                        answer.setCorrectOption(questionCorrectOption);
                        userAnswerRepository.save(answer);
                        fixed++;
                    }
                }
            }
            
            return ResponseEntity.ok("Fixed " + fixed + " user answers");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Fix specific result using SQL update
     */
    @PostMapping("/fix-result/{resultId}")
    public ResponseEntity<String> fixResult(@PathVariable Long resultId) {
        try {
            int updated = userAnswerRepository.updateCorrectAnswersForResult(resultId);
            return ResponseEntity.ok("Updated " + updated + " answers for result " + resultId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Test question correct options
     */
    @GetMapping("/test-correct-options/{resultId}")
    public ResponseEntity<String> testCorrectOptions(@PathVariable Long resultId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("Testing correct options for result: ").append(resultId).append("\n\n");
            
            List<Object[]> rawData = userAnswerRepository.findByResultIdWithQuestionCorrectOption(resultId);
            debug.append("Found ").append(rawData.size()).append(" raw answer records\n");
            
            for (Object[] row : rawData) {
                debug.append("Answer (").append(row.length).append(" columns):\n");
                debug.append("  - Answer ID: ").append(row[0]).append("\n");
                debug.append("  - Selected: ").append(row[7]).append("\n");  // selected_option should be column 7
                debug.append("  - Question Correct: ").append(row[row.length-1]).append("\n");  // last column
                debug.append("  - Is Match: ").append(row[7] != null && row[7].equals(row[row.length-1])).append("\n\n");
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Simple debug endpoint - no auth required
     */
    @GetMapping("/debug/simple/{userId}")
    public ResponseEntity<String> debugSimple(@PathVariable Long userId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("Simple debug for user: ").append(userId).append("\n");
            
            // Test simple query
            List<UserResult> results = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
            debug.append("Found ").append(results.size()).append(" results\n");
            
            for (UserResult r : results) {
                debug.append("Result ").append(r.getResultId()).append(":\n");
                
                // Test answers
                List<UserAnswer> answers = userAnswerRepository.findByResultId(r.getResultId());
                debug.append("  - Answers: ").append(answers.size()).append("\n");
                
                if (!answers.isEmpty()) {
                    debug.append("  - First answer isCorrect: ").append(answers.get(0).getIsCorrect()).append("\n");
                    debug.append("  - Skip this result? ").append(answers.isEmpty()).append("\n");
                }
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Debug user specific count
     */
    @GetMapping("/debug/user/{userId}/count")
    public ResponseEntity<String> debugUserCount(@PathVariable Long userId) {
        try {
            List<Object[]> results = userResultRepository.debugAllResultsNative();
            int userCount = 0;
            StringBuilder debug = new StringBuilder();
            debug.append("Checking user ID: ").append(userId).append("\n");
            
            for (Object[] result : results) {
                Long resultUserId = ((Number) result[1]).longValue();
                debug.append("Found result with user_id: ").append(resultUserId).append("\n");
                if (resultUserId.equals(userId)) {
                    userCount++;
                }
            }
            
            debug.append("Total results for user ").append(userId).append(": ").append(userCount);
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Debug endpoint để test queries
     */
    @GetMapping("/debug/user/{userId}/raw")
    public ResponseEntity<String> debugUserRawResults(@PathVariable Long userId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("Raw data for user ID: ").append(userId).append("\n\n");
            
            // Test simple query first
            List<UserResult> results = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
            debug.append("Found ").append(results.size()).append(" UserResult objects\n");
            
            for (int i = 0; i < results.size() && i < 3; i++) {
                UserResult r = results.get(i);
                debug.append("Result ").append(i + 1).append(":\n");
                debug.append("  - ID: ").append(r.getResultId()).append("\n");
                debug.append("  - User ID: ").append(r.getUser() != null ? r.getUser().getId() : "NULL").append("\n");
                debug.append("  - Test ID: ").append(r.getTest() != null ? r.getTest().getTestId() : "NULL").append("\n");
                debug.append("  - Total Score: ").append(r.getTotalScore()).append("\n");
                debug.append("  - Started At: ").append(r.getStartedAt()).append("\n");
                debug.append("  - Finished At: ").append(r.getFinishedAt()).append("\n");
                
                // Test UserAnswer query
                try {
                    List<UserAnswer> answers = userAnswerRepository.findByResultId(r.getResultId());
                    debug.append("  - Found ").append(answers.size()).append(" answers\n");
                    if (!answers.isEmpty()) {
                        UserAnswer firstAnswer = answers.get(0);
                        debug.append("    - First answer isCorrect: ").append(firstAnswer.getIsCorrect()).append("\n");
                    }
                } catch (Exception e) {
                    debug.append("    - Error loading answers: ").append(e.getMessage()).append("\n");
                }
                debug.append("\n");
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    /**
     * Debug endpoint để test queries
     */
    @GetMapping("/debug/user/{userId}/results")
    public ResponseEntity<String> debugUserResults(@PathVariable Long userId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("Testing queries for user ID: ").append(userId).append("\n\n");
            
            // Test 1: JOIN FETCH query
            try {
                List<UserResult> results1 = userResultRepository.findByUserIdWithJoin(userId);
                debug.append("1. JOIN FETCH query found: ").append(results1.size()).append(" results\n");
                for (UserResult r : results1) {
                    debug.append("   - Result ID: ").append(r.getResultId())
                         .append(", Score: ").append(r.getTotalScore()).append("\n");
                }
            } catch (Exception e) {
                debug.append("1. JOIN FETCH query error: ").append(e.getMessage()).append("\n");
            }
            
            // Test 2: Native query
            try {
                List<UserResult> results2 = userResultRepository.findByUserIdNative(userId);
                debug.append("2. Native query found: ").append(results2.size()).append(" results\n");
                for (UserResult r : results2) {
                    debug.append("   - Result ID: ").append(r.getResultId())
                         .append(", Score: ").append(r.getTotalScore()).append("\n");
                }
            } catch (Exception e) {
                debug.append("2. Native query error: ").append(e.getMessage()).append("\n");
            }
            
            // Test 3: Simple JPQL query
            try {
                List<UserResult> results3 = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
                debug.append("3. Simple JPQL query found: ").append(results3.size()).append(" results\n");
                for (UserResult r : results3) {
                    debug.append("   - Result ID: ").append(r.getResultId())
                         .append(", Score: ").append(r.getTotalScore()).append("\n");
                }
            } catch (Exception e) {
                debug.append("3. Simple JPQL query error: ").append(e.getMessage()).append("\n");
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/debug/all")
    public ResponseEntity<String> debugAllResults() {
        try {
            // Use native query to avoid lazy loading
            List<Object[]> allResults = userResultRepository.debugAllResultsNative();
            StringBuilder debug = new StringBuilder();
            debug.append("Total results in database: ").append(allResults.size()).append("\n\n");
            
            // Test UserAnswer queries for user 10's results
            for (Object[] result : allResults) {
                Long resultId = ((Number) result[0]).longValue();
                Long userId = ((Number) result[1]).longValue();
                
                if (userId.equals(10L)) {
                    debug.append("Result ID: ").append(resultId)
                         .append(", User ID: ").append(userId)
                         .append(", Test ID: ").append(result[2]).append("\n");
                    
                    try {
                        List<UserAnswer> answers = userAnswerRepository.findByResultId(resultId);
                        debug.append("  - UserAnswers found: ").append(answers.size()).append("\n");
                    } catch (Exception e) {
                        debug.append("  - UserAnswer query error: ").append(e.getMessage()).append("\n");
                    }
                }
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    /**
     * Lấy danh sách tất cả kết quả test của user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TestResultDetail>> getUserTestResults(@PathVariable Long userId) {
        try {
            System.out.println("Getting test results for user: " + userId);
            
            // Use JPQL query with JOIN FETCH to avoid lazy loading issues
            try {
                List<UserResult> results = userResultRepository.findByUserIdWithJoin(userId);
                System.out.println("JOIN FETCH query found " + results.size() + " results");
                
                if (results.isEmpty()) {
                    System.out.println("Trying native query as fallback...");
                    results = userResultRepository.findByUserIdNative(userId);
                    System.out.println("Native query found " + results.size() + " results");
                }
                
                if (results.isEmpty()) {
                    System.out.println("Trying simple JPQL query as fallback...");
                    results = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
                    System.out.println("Simple JPQL found " + results.size() + " results");
                }
                
                System.out.println("About to process " + results.size() + " results for conversion");
                List<TestResultDetail> resultDetails = new ArrayList<>();
                for (UserResult result : results) {
                    try {
                        System.out.println("Processing result ID: " + result.getResultId());
                        System.out.println("Result user: " + (result.getUser() != null ? result.getUser().getId() : "NULL"));
                        System.out.println("Result test: " + (result.getTest() != null ? result.getTest().getTestId() : "NULL"));
                        
                        // Calculate correct answers and percentage
                        List<UserAnswer> answers = userAnswerRepository.findByResultId(result.getResultId());
                        System.out.println("Found " + answers.size() + " answers for result " + result.getResultId());
                        
                        // DEBUG: Test native count query
                        try {
                            Long nativeCount = userAnswerRepository.debugCountByResultId(result.getResultId());
                            System.out.println("Native count query found " + nativeCount + " answers for result " + result.getResultId());
                        } catch (Exception e) {
                            System.out.println("Native count query failed: " + e.getMessage());
                        }
                        
                        // TEMPORARILY REMOVE THE SKIP LOGIC TO SEE IF RESULTS GET PROCESSED
                        // if (answers.isEmpty()) {
                        //     System.out.println("No answers found for result " + result.getResultId() + ", skipping...");
                        //     continue;
                        // }
                        
                        int correctAnswers = 0;
                        if (!answers.isEmpty()) {
                            // Debug individual answers
                            for (int i = 0; i < answers.size(); i++) {
                                UserAnswer answer = answers.get(i);
                                System.out.println("Answer " + (i+1) + " - isCorrect: " + answer.getIsCorrect() + 
                                                 ", selectedOption: " + answer.getSelectedOption() + 
                                                 ", correctOption: " + answer.getCorrectOption());
                                
                                // RUNTIME FIX: Calculate isCorrect from question if not set
                                if (answer.getIsCorrect() == null && answer.getQuestion() != null) {
                                    String questionCorrectOption = answer.getQuestion().getCorrectOption();
                                    String selectedOption = answer.getSelectedOption();
                                    boolean isActuallyCorrect = questionCorrectOption != null && 
                                                               questionCorrectOption.equals(selectedOption);
                                    System.out.println("  Runtime calculation: question.correctOption=" + questionCorrectOption + 
                                                     ", selected=" + selectedOption + ", isCorrect=" + isActuallyCorrect);
                                    
                                    if (isActuallyCorrect) {
                                        correctAnswers++;
                                    }
                                } else if (answer.getIsCorrect() != null && answer.getIsCorrect()) {
                                    correctAnswers++;
                                }
                            }
                        }
                        int totalQuestions = answers.size();
                        double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0.0;
                        
                        System.out.println("Stats for result " + result.getResultId() + ": " + correctAnswers + "/" + totalQuestions + " (" + percentage + "%)");
                        
                        TestResultDetail detail = new TestResultDetail(
                            result.getResultId(),
                            result.getTest() != null ? result.getTest().getTitle() : "TOEIC Test " + result.getResultId(),
                            result.getTotalScore(),
                            result.getScoreListen(),
                            result.getScoreRead(),
                            totalQuestions,
                            correctAnswers,
                            percentage,
                            result.getStartedAt() != null ? result.getStartedAt().toLocalDateTime() : null,
                            result.getFinishedAt() != null ? result.getFinishedAt().toLocalDateTime() : null
                        );
                        resultDetails.add(detail);
                        System.out.println("Successfully converted result ID: " + result.getResultId() + 
                                         " with " + correctAnswers + "/" + totalQuestions + " correct (" + percentage + "%)");
                    } catch (Exception e) {
                        System.err.println("Error converting result " + result.getResultId() + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                }
                
                System.out.println("Successfully converted " + resultDetails.size() + " details");
                return ResponseEntity.ok(resultDetails);
            } catch (Exception queryEx) {
                System.err.println("Error in queries: " + queryEx.getMessage());
                queryEx.printStackTrace();
                return ResponseEntity.status(500).build();
            }
        } catch (Exception e) {
            System.err.println("Error in getUserTestResults: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Lấy chi tiết kết quả test cụ thể (bao gồm từng câu trả lời) - No Auth for testing
     */
    @GetMapping("/{resultId}/detail-test")
    public ResponseEntity<TestResultDetail> getTestResultDetailTest(@PathVariable Long resultId) {
        try {
            System.out.println("Getting test result detail for result ID: " + resultId);
            
            UserResult result = userResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found with ID: " + resultId));
            
            System.out.println("Found result: " + result.getResultId());
            
            // Calculate correct answers and percentage
            List<UserAnswer> answers = userAnswerRepository.findByResultId(resultId);
            System.out.println("Found " + answers.size() + " answers");
            
            int correctAnswers = (int) answers.stream()
                .mapToInt(answer -> (answer.getIsCorrect() != null && answer.getIsCorrect()) ? 1 : 0)
                .sum();
            int totalQuestions = answers.size();
            double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0.0;
            
            TestResultDetail testDetail = new TestResultDetail(
                result.getResultId(),
                result.getTest() != null ? result.getTest().getTitle() : "TOEIC Test " + result.getResultId(),
                result.getTotalScore(),
                result.getScoreListen(),
                result.getScoreRead(),
                totalQuestions,
                correctAnswers,
                percentage,
                result.getStartedAt() != null ? result.getStartedAt().toLocalDateTime() : null,
                result.getFinishedAt() != null ? result.getFinishedAt().toLocalDateTime() : null
            );
            
            // Lấy chi tiết các câu trả lời
            List<TestResultDetail.QuestionAnswerDetail> answerDetails = answers.stream()
                .map(this::convertToQuestionAnswerDetail)
                .filter(answerDetail -> answerDetail != null) // Filter out null results
                .collect(Collectors.toList());
            
            testDetail.setAnswers(answerDetails);
            
            System.out.println("Successfully created detail with " + answerDetails.size() + " answers");
            
            return ResponseEntity.ok(testDetail);
        } catch (Exception e) {
            System.err.println("Error in getTestResultDetailTest: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    @GetMapping("/{resultId}/detail")
    public ResponseEntity<?> getTestResultDetail(@PathVariable Long resultId) {
        try {
            System.out.println("Getting test result detail for result ID: " + resultId);
            
            UserResult result = userResultRepository.findByIdWithJoinFetch(resultId);
            if (result == null) {
                return ResponseEntity.notFound().build();
            }
            
            System.out.println("Found result: " + result.getResultId());
            
            // Calculate correct answers and percentage
            List<UserAnswer> answers = userAnswerRepository.findByResultId(resultId);
            System.out.println("Found " + answers.size() + " answers");
            
            int correctAnswers = (int) answers.stream()
                .mapToInt(answer -> (answer.getIsCorrect() != null && answer.getIsCorrect()) ? 1 : 0)
                .sum();
            int totalQuestions = answers.size();
            double percentage = totalQuestions > 0 ? (double) correctAnswers / totalQuestions * 100 : 0.0;
            
            // Tạo response đơn giản trước
            Map<String, Object> response = new HashMap<>();
            response.put("resultId", result.getResultId());
            response.put("testTitle", result.getTest() != null ? result.getTest().getTitle() : "TOEIC Test " + result.getResultId());
            response.put("totalScore", result.getTotalScore());
            response.put("listeningScore", result.getScoreListen());
            response.put("readingScore", result.getScoreRead());
            response.put("totalQuestions", totalQuestions);
            response.put("correctAnswers", correctAnswers);
            response.put("percentage", percentage);
            response.put("startedAt", result.getStartedAt());
            response.put("finishedAt", result.getFinishedAt());
            
            // Test convert từng answer
            List<Map<String, Object>> answerDetails = new ArrayList<>();
            for (UserAnswer answer : answers) {
                try {
                    Map<String, Object> answerDetail = new HashMap<>();
                    QuestionTest question = answer.getQuestion();
                    
                    if (question != null) {
                        answerDetail.put("questionId", question.getQuestionId());
                        answerDetail.put("questionText", question.getQuestionText());
                        answerDetail.put("audioUrl", question.getAudioUrl());
                        answerDetail.put("imageUrl", question.getImageUrl());
                        answerDetail.put("partNumber", answer.getPartNumber() != null ? answer.getPartNumber() : question.getPartNumber());
                        answerDetail.put("correctAnswer", answer.getCorrectOption());
                        answerDetail.put("userAnswer", answer.getSelectedOption());
                        answerDetail.put("isCorrect", answer.getIsCorrect());
                        
                        // Lấy options cho câu hỏi
                        try {
                            List<Map<String, Object>> options = new ArrayList<>();
                            if (question.getOptions() != null) {
                                for (var option : question.getOptions()) {
                                    Map<String, Object> optionMap = new HashMap<>();
                                    optionMap.put("optionId", option.getOptionId());
                                    optionMap.put("label", option.getLabel());
                                    optionMap.put("content", option.getContent());
                                    options.add(optionMap);
                                }
                            }
                            answerDetail.put("options", options);
                        } catch (Exception e) {
                            System.err.println("Error loading options: " + e.getMessage());
                            answerDetail.put("options", new ArrayList<>());
                        }
                    } else {
                        answerDetail.put("questionId", null);
                        answerDetail.put("questionText", "Question not found");
                        answerDetail.put("audioUrl", null);
                        answerDetail.put("imageUrl", null);
                        answerDetail.put("partNumber", answer.getPartNumber());
                        answerDetail.put("correctAnswer", answer.getCorrectOption());
                        answerDetail.put("userAnswer", answer.getSelectedOption());
                        answerDetail.put("isCorrect", answer.getIsCorrect());
                        answerDetail.put("options", new ArrayList<>());
                    }
                    
                    answerDetails.add(answerDetail);
                } catch (Exception e) {
                    System.err.println("Error processing answer: " + e.getMessage());
                    e.printStackTrace();
                }
            }
            
            response.put("answers", answerDetails);
            
            System.out.println("Successfully created response with " + answerDetails.size() + " answers");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error in getTestResultDetail: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
    
    /**
     * Lấy kết quả test theo part cụ thể
     */
    @GetMapping("/{resultId}/part/{partNumber}")
    public ResponseEntity<List<TestResultDetail.QuestionAnswerDetail>> getTestResultByPart(
            @PathVariable Long resultId, @PathVariable Integer partNumber) {
        try {
            List<UserAnswer> answers = userAnswerRepository.findByResultIdAndPartNumber(resultId, partNumber);
            List<TestResultDetail.QuestionAnswerDetail> answerDetails = answers.stream()
                .map(this::convertToQuestionAnswerDetail)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(answerDetails);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Xóa kết quả test
     */
    @DeleteMapping("/{resultId}")
    public ResponseEntity<String> deleteTestResult(@PathVariable Long resultId) {
        try {
            userResultRepository.deleteById(resultId);
            return ResponseEntity.ok("Test result deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting test result");
        }
    }
    
    /**
     * POST endpoint for debugging - bypass cache
     */
    @PostMapping("/debug/user/{userId}")
    public ResponseEntity<String> debugUserPost(@PathVariable Long userId) {
        try {
            StringBuilder debug = new StringBuilder();
            debug.append("POST Debug for user: ").append(userId).append("\n\n");
            
            // Test basic query
            List<UserResult> results = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
            debug.append("Found ").append(results.size()).append(" UserResult objects\n");
            
            for (UserResult r : results) {
                debug.append("Result ").append(r.getResultId()).append(":\n");
                
                // Test both queries
                try {
                    List<UserAnswer> answers = userAnswerRepository.findByResultId(r.getResultId());
                    debug.append("  - JPQL query: ").append(answers.size()).append(" answers\n");
                } catch (Exception e) {
                    debug.append("  - JPQL query error: ").append(e.getMessage()).append("\n");
                }
                
                try {
                    Long count = userAnswerRepository.debugCountByResultId(r.getResultId());
                    debug.append("  - Native count: ").append(count).append(" answers\n");
                } catch (Exception e) {
                    debug.append("  - Native count error: ").append(e.getMessage()).append("\n");
                }
            }
            
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    // Helper methods
    private TestResultDetail convertToTestResultDetail(UserResult result) {
        return new TestResultDetail(
            result.getResultId(),
            result.getTest() != null ? result.getTest().getTitle() : "Unknown Test",
            result.getTotalScore(),
            result.getScoreListen(),
            result.getScoreRead(),
            result.getTest() != null ? result.getTest().getTestQuestions().size() : 0,
            0, // Will be calculated from answers if needed
            0.0, // Will be calculated from answers if needed
            result.getStartedAt() != null ? result.getStartedAt().toLocalDateTime() : null,
            result.getFinishedAt() != null ? result.getFinishedAt().toLocalDateTime() : null
        );
    }
    
    private TestResultDetail.QuestionAnswerDetail convertToQuestionAnswerDetail(UserAnswer answer) {
        try {
            QuestionTest question = answer.getQuestion();
            if (question == null) {
                System.err.println("Question is null for answer");
                return null;
            }
            
            TestResultDetail.QuestionAnswerDetail detail = new TestResultDetail.QuestionAnswerDetail(
                question.getQuestionId(),
                question.getQuestionText() != null ? question.getQuestionText() : "Question text not available",
                answer.getSelectedOption() != null ? answer.getSelectedOption() : "N/A",
                answer.getCorrectOption() != null ? answer.getCorrectOption() : "N/A",
                answer.getIsCorrect() != null ? answer.getIsCorrect() : false,
                answer.getPartNumber() != null ? answer.getPartNumber() : 0,
                answer.getAnsweredAt(),
                question.getImageUrl(),
                question.getAudioUrl()
            );
            
            // Lấy các options cho câu hỏi
            try {
                List<Option> options = optionRepository.findByQuestionQuestionIdOrderByLabel(question.getQuestionId());
                List<TestResultDetail.OptionDetail> optionDetails = options.stream()
                    .map(option -> new TestResultDetail.OptionDetail(
                        option.getLabel() != null ? option.getLabel() : "?", 
                        option.getContent() != null ? option.getContent() : "Option content not available"
                    ))
                    .collect(Collectors.toList());
                detail.setOptions(optionDetails);
            } catch (Exception e) {
                System.err.println("Error loading options for question " + question.getQuestionId() + ": " + e.getMessage());
                detail.setOptions(List.of());
            }
            
            return detail;
        } catch (Exception e) {
            System.err.println("Error converting question answer detail: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
