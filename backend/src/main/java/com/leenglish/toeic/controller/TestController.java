package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.RandomTestRequest;
import com.leenglish.toeic.dto.TestSelectionResponse;
import com.leenglish.toeic.dto.TestDetailsResponse;
import com.leenglish.toeic.dto.TestPartResponse;
import com.leenglish.toeic.dto.TestQuestionResponse;
import com.leenglish.toeic.dto.TestOptionResponse;
import com.leenglish.toeic.service.TestGenerationService;
import com.leenglish.toeic.repository.TestRepository;
import com.leenglish.toeic.repository.TestQuestionRepository;
import com.leenglish.toeic.repository.QuestionTestRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.domain.Test;
import com.leenglish.toeic.domain.TestQuestion;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.MembershipType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.stream.Collectors;

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

    @Autowired
    private QuestionTestRepository questionTestRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper method to check if user has premium access
    private boolean hasPremiumAccess() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && 
                !authentication.getName().equals("anonymousUser")) {
                
                String username = authentication.getName();
                Optional<User> userOpt = userRepository.findByUsernameOrEmail(username, username);
                
                if (userOpt.isPresent()) {
                    User user = userOpt.get();
                    MembershipType membershipType = user.getMembershipType();
                    return membershipType == MembershipType.PREMIUM || membershipType == MembershipType.VIP;
                }
            }
            return false;
        } catch (Exception e) {
            System.out.println("Error checking premium access: " + e.getMessage());
            return false;
        }
    }

    // Test endpoint for debugging audio access
    @GetMapping("/debug/audio")
    @Transactional
    public ResponseEntity<?> debugAudioAccess() {
        try {
            List<TestQuestion> questionsWithAudio = testQuestionRepository.findAll()
                .stream()
                .filter(tq -> tq.getQuestion() != null && 
                             tq.getQuestion().getAudioUrl() != null && 
                             !tq.getQuestion().getAudioUrl().isEmpty())
                .limit(5)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "message", "Audio debug endpoint",
                "questionsWithAudio", questionsWithAudio.size(),
                "sampleUrls", questionsWithAudio.stream()
                    .map(tq -> Map.of(
                        "questionId", tq.getQuestion().getQuestionId(),
                        "audioUrl", tq.getQuestion().getAudioUrl(),
                        "fullUrl", "http://localhost:8080" + tq.getQuestion().getAudioUrl()
                    ))
                    .toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/debug/content")
    @Transactional
    public ResponseEntity<?> debugContentAccess() {
        try {
            List<TestQuestion> questionsWithContent = testQuestionRepository.findAll()
                .stream()
                .filter(tq -> tq.getQuestion() != null && 
                             tq.getQuestion().getGroup() != null &&
                             tq.getQuestion().getGroup().getContent() != null &&
                             !tq.getQuestion().getGroup().getContent().isEmpty() &&
                             (tq.getPartNumber() == 6 || tq.getPartNumber() == 7))
                .limit(10)
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "message", "Content debug endpoint",
                "questionsWithContent", questionsWithContent.size(),
                "sampleContent", questionsWithContent.stream()
                    .map(tq -> Map.of(
                        "questionId", tq.getQuestion().getQuestionId(),
                        "partNumber", tq.getPartNumber(),
                        "groupId", tq.getQuestion().getGroup() != null ? tq.getQuestion().getGroup().getGroupId() : null,
                        "content", tq.getQuestion().getGroup() != null ? tq.getQuestion().getGroup().getContent() : null
                    ))
                    .toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

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
    public ResponseEntity<?> generateQuickRandomTest() {
        try {
            // Check if user has premium access
            if (!hasPremiumAccess()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "error", "PREMIUM_REQUIRED",
                        "message", "Tính năng tạo Quick Test chỉ dành cho thành viên Premium và VIP. Vui lòng nâng cấp tài khoản để sử dụng.",
                        "upgradeRequired", true
                    ));
            }
            
            TestSelectionResponse response = testGenerationService.generateQuickRandomTest();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/selection/generate-full")
    public ResponseEntity<?> generateFullRandomTest() {
        try {
            // Check if user has premium access
            if (!hasPremiumAccess()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                        "error", "PREMIUM_REQUIRED", 
                        "message", "Tính năng tạo Full TOEIC Test chỉ dành cho thành viên Premium và VIP. Vui lòng nâng cấp tài khoản để sử dụng.",
                        "upgradeRequired", true
                    ));
            }
            
            RandomTestRequest fullRequest = new RandomTestRequest(
                "Full TOEIC Practice Test",
                "Complete 200-question TOEIC practice test with all parts",
                true // useFullTOEICStructure = true
            );
            TestSelectionResponse response = testGenerationService.generateRandomTest(fullRequest);
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
            System.out.println("Getting test parts for testId: " + testId);
            List<TestQuestion> testQuestions = testQuestionRepository.findByTestIdWithQuestionAndOptions(testId);
            
            if (testQuestions.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Group questions by part number and return part structure
            Map<Integer, String> partTitles = Map.of(
                1, "Part 1: Picture Description",
                2, "Part 2: Question-Response", 
                3, "Part 3: Conversations",
                4, "Part 4: Talks",
                5, "Part 5: Incomplete Sentences",
                6, "Part 6: Text Completion",
                7, "Part 7: Reading Comprehension"
            );
            
            Map<Integer, String> partDescriptions = Map.of(
                1, "Look at the picture and choose the statement that best describes what you see.",
                2, "Listen to the question and choose the best response.",
                3, "Listen to the conversation and answer questions about it.",
                4, "Listen to the talk and answer questions about it.", 
                5, "Choose the word or phrase that best completes the sentence.",
                6, "Read the text and choose the best answer for each blank.",
                7, "Read the passage and answer questions about it."
            );
            
            List<TestPartResponse> response = testQuestions.stream()
                .collect(Collectors.groupingBy(TestQuestion::getPartNumber))
                .entrySet().stream()
                .map(entry -> {
                    Integer partNumber = entry.getKey();
                    TestPartResponse part = new TestPartResponse();
                    part.setPartId((long) partNumber);
                    part.setPartNumber(partNumber);
                    part.setTitle(partTitles.getOrDefault(partNumber, "Part " + partNumber));
                    part.setDescription(partDescriptions.getOrDefault(partNumber, ""));
                    return part;
                })
                .sorted(Comparator.comparing(TestPartResponse::getPartNumber))
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{testId}/questions")
    public ResponseEntity<List<TestQuestionResponse>> getAllQuestionsForTest(@PathVariable Long testId) {
        try {
            System.out.println("Getting all questions for testId: " + testId);
            List<TestQuestion> testQuestions = testQuestionRepository.findByTestIdWithQuestionAndOptions(testId);
            
            if (testQuestions.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Sort all questions by part number and question order
            List<TestQuestion> sortedQuestions = testQuestions.stream()
                .sorted(Comparator.comparing(TestQuestion::getPartNumber)
                    .thenComparing(TestQuestion::getQuestionOrder))
                .collect(Collectors.toList());
            
            List<TestQuestionResponse> response = sortedQuestions.stream().map(tq -> {
                TestQuestionResponse question = new TestQuestionResponse();
                question.setQuestionId(tq.getQuestion().getQuestionId());
                question.setPartNumber(tq.getPartNumber());
                question.setQuestionOrder(tq.getQuestionOrder());
                question.setQuestionText(tq.getQuestion().getQuestionText());
                
                String audioUrl = tq.getQuestion().getAudioUrl();
                String imageUrl = tq.getQuestion().getImageUrl();
                
                question.setAudioUrl(audioUrl);
                question.setImageUrl(imageUrl);
                
                // Add content from QuestionGroup for reading comprehension parts (6 & 7)
                if ((tq.getPartNumber() == 6 || tq.getPartNumber() == 7) && tq.getQuestion().getGroup() != null) {
                    question.setContent(tq.getQuestion().getGroup().getContent());
                } else if (tq.getPartNumber() == 6) {
                    // Fallback content for Part 6 if no group content
                    question.setContent("""
                        Subject: Regarding Our New Branch Office

                        Dear Team,

                        I am pleased to announce that our company will be expanding its operations this year. ------- (131) new employees for our upcoming Windsor location has been a priority for the management team. The human resources department has been working diligently to find qualified candidates who meet our high standards.

                        Our technical support team has been ------- (132) the new office systems will integrate seamlessly with our existing infrastructure. We believe ------- (133) this expansion will allow us to better serve our clients in the region.

                        The new branch will focus on providing ------- (134) customer service to our growing client base. All staff members will undergo comprehensive training to ensure they are fully prepared for their new roles.

                        We are confident that this expansion will strengthen our position in the market and contribute to the company's continued success.

                        Best regards,
                        Regional Manager
                        """);
                } else if (tq.getPartNumber() == 7) {
                    // Fallback content for Part 7 if no group content  
                    question.setContent("""
                        MEMO

                        TO: All Staff Members
                        FROM: Human Resources Department  
                        DATE: July 15, 2024
                        RE: Holiday Schedule Policy Update

                        We would like to inform all employees about an important update to our holiday request policy that will take effect immediately.

                        Due to the upcoming July 4th holiday weekend and the high volume of vacation requests we have received, we need to implement temporary scheduling adjustments. We have discovered that 35% of our planned staff have requested time off on July 5th, which exceeds our maximum allowable absence rate of 25%.

                        To ensure adequate coverage during this busy period, we are implementing the following temporary measures:

                        1. All time-off requests for July 5th and July 6th must be approved by department supervisors
                        2. Priority will be given to requests submitted before June 22nd
                        3. Emergency staffing procedures will be in effect for the entire holiday weekend

                        Please note that this is a temporary measure and our regular policies will resume on July 8th. We appreciate your understanding and cooperation during this transition period.

                        If you have any questions about these temporary changes, please contact your immediate supervisor or the HR department at extension 2847.

                        Thank you for your continued dedication to maintaining our high standards of customer service.

                        Human Resources Department
                        """);
                }
                
                // Set options from the question
                List<TestOptionResponse> options = new ArrayList<>();
                if (tq.getQuestion().getOptions() != null && !tq.getQuestion().getOptions().isEmpty()) {
                    for (var option : tq.getQuestion().getOptions()) {
                        if (option.getLabel() != null && option.getContent() != null) {
                            TestOptionResponse optionResponse = new TestOptionResponse();
                            optionResponse.setOptionId(option.getOptionId());
                            optionResponse.setLabel(option.getLabel());
                            optionResponse.setContent(option.getContent());
                            options.add(optionResponse);
                        }
                    }
                }
                question.setOptions(options);
                
                return question;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{testId}/part/{partNumber}/questions")
    public ResponseEntity<List<TestQuestionResponse>> getQuestionsForPart(
            @PathVariable Long testId, 
            @PathVariable Integer partNumber) {
        try {
            System.out.println("Getting questions for testId: " + testId + ", part: " + partNumber);
            List<TestQuestion> testQuestions = testQuestionRepository.findByTestIdWithQuestionAndOptions(testId);
            
            if (testQuestions.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Filter questions for the specific part
            List<TestQuestion> partQuestions = testQuestions.stream()
                .filter(tq -> tq.getPartNumber().equals(partNumber))
                .sorted(Comparator.comparing(TestQuestion::getQuestionOrder))
                .collect(Collectors.toList());
            
            if (partQuestions.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            List<TestQuestionResponse> response = partQuestions.stream().map(tq -> {
                TestQuestionResponse question = new TestQuestionResponse();
                question.setQuestionId(tq.getQuestion().getQuestionId());
                question.setPartNumber(tq.getPartNumber());
                question.setQuestionOrder(tq.getQuestionOrder());
                question.setQuestionText(tq.getQuestion().getQuestionText());
                
                String audioUrl = tq.getQuestion().getAudioUrl();
                String imageUrl = tq.getQuestion().getImageUrl();
                
                question.setAudioUrl(audioUrl);
                question.setImageUrl(imageUrl);
                
                // Add content from QuestionGroup for reading comprehension parts (6 & 7)
                if ((partNumber == 6 || partNumber == 7) && tq.getQuestion().getGroup() != null) {
                    question.setContent(tq.getQuestion().getGroup().getContent());
                } else if (partNumber == 6) {
                    // Fallback content for Part 6 if no group content
                    question.setContent("""
                        Subject: Regarding Our New Branch Office

                        Dear Team,

                        I am pleased to announce that our company will be expanding its operations this year. ------- (131) new employees for our upcoming Windsor location has been a priority for the management team. The human resources department has been working diligently to find qualified candidates who meet our high standards.

                        Our technical support team has been ------- (132) the new office systems will integrate seamlessly with our existing infrastructure. We believe ------- (133) this expansion will allow us to better serve our clients in the region.

                        The new branch will focus on providing ------- (134) customer service to our growing client base. All staff members will undergo comprehensive training to ensure they are fully prepared for their new roles.

                        We are confident that this expansion will strengthen our position in the market and contribute to the company's continued success.

                        Best regards,
                        Regional Manager
                        """);
                } else if (partNumber == 7) {
                    // Fallback content for Part 7 if no group content  
                    question.setContent("""
                        MEMO

                        TO: All Staff Members
                        FROM: Human Resources Department  
                        DATE: July 15, 2024
                        RE: Holiday Schedule Policy Update

                        We would like to inform all employees about an important update to our holiday request policy that will take effect immediately.

                        Due to the upcoming July 4th holiday weekend and the high volume of vacation requests we have received, we need to implement temporary scheduling adjustments. We have discovered that 35% of our planned staff have requested time off on July 5th, which exceeds our maximum allowable absence rate of 25%.

                        To ensure adequate coverage during this busy period, we are implementing the following temporary measures:

                        1. All time-off requests for July 5th and July 6th must be approved by department supervisors
                        2. Priority will be given to requests submitted before June 22nd
                        3. Emergency staffing procedures will be in effect for the entire holiday weekend

                        Please note that this is a temporary measure and our regular policies will resume on July 8th. We appreciate your understanding and cooperation during this transition period.

                        If you have any questions about these temporary changes, please contact your immediate supervisor or the HR department at extension 2847.

                        Thank you for your continued dedication to maintaining our high standards of customer service.

                        Human Resources Department
                        """);
                }
                
                // Set options from the question
                List<TestOptionResponse> options = new ArrayList<>();
                if (tq.getQuestion().getOptions() != null && !tq.getQuestion().getOptions().isEmpty()) {
                    for (var option : tq.getQuestion().getOptions()) {
                        if (option.getLabel() != null && option.getContent() != null) {
                            TestOptionResponse optionResponse = new TestOptionResponse();
                            optionResponse.setOptionId(option.getOptionId());
                            optionResponse.setLabel(option.getLabel());
                            optionResponse.setContent(option.getContent());
                            options.add(optionResponse);
                        }
                    }
                }
                question.setOptions(options);
                
                return question;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/debug/question-count")
    @Transactional
    public ResponseEntity<?> debugQuestionCount() {
        try {
            List<com.leenglish.toeic.domain.QuestionTest> allQuestions = questionTestRepository.findAll();
            
            Map<Integer, Long> questionsByPart = allQuestions.stream()
                .collect(Collectors.groupingBy(
                    q -> q.getPartNumber(), 
                    Collectors.counting()
                ));
            
            return ResponseEntity.ok(Map.of(
                "message", "Question count by part",
                "totalQuestions", allQuestions.size(),
                "questionsByPart", questionsByPart,
                "sampleQuestions", allQuestions.stream()
                    .limit(5)
                    .map(q -> Map.of(
                        "questionId", q.getQuestionId(),
                        "partNumber", q.getPartNumber(),
                        "questionText", q.getQuestionText(),
                        "hasOptions", q.getOptions() != null && !q.getOptions().isEmpty()
                    ))
                    .toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
