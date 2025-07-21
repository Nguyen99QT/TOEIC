/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.controller;

/**
 *
 * @author caong
 */

import com.leenglish.toeic.dto.QuestionGroupRequestDTO;
import com.leenglish.toeic.dto.QuestionRequestDTO;
import com.leenglish.toeic.dto.OptionRequestDTO;
import com.leenglish.toeic.domain.QuestionGroup;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.service.QuestionGroupService;
import com.leenglish.toeic.service.UserService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.*;
import java.security.Principal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/question-group")
public class QuestionGroupController {

    @Autowired
    private QuestionGroupService questionGroupService;
    
    @Autowired
    private UserService userService;

    private static final String UPLOAD_ROOT = "uploads";

    @PostMapping(value = "/create-with-questions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<QuestionGroup> createGroupWithQuestions(
        @RequestPart("group") @Valid QuestionGroupRequestDTO dto,
        @RequestPart(value = "audio", required = false) MultipartFile audio,
        @RequestPart(value = "image", required = false) MultipartFile image,
        Principal principal
    ) {
        try {
            System.out.println("🔍 Received QuestionGroupRequestDTO:");
            System.out.println("Title: " + dto.getTitle());
            System.out.println("Type: " + dto.getType());
            System.out.println("Content: " + dto.getContent());
            System.out.println("PartId: " + dto.getPartId());
            System.out.println("Questions count: " + (dto.getQuestions() != null ? dto.getQuestions().size() : "null"));
            System.out.println("Principal: " + (principal != null ? principal.getName() : "NULL - No authentication!"));
            
            if (dto.getQuestions() != null) {
                for (int i = 0; i < dto.getQuestions().size(); i++) {
                    var q = dto.getQuestions().get(i);
                    System.out.println("Question " + i + ": " + q.getQuestionText());
                    System.out.println("Correct Option: " + q.getCorrectOption());
                    System.out.println("Options count: " + (q.getOptions() != null ? q.getOptions().size() : "null"));
                    if (q.getOptions() != null) {
                        for (var opt : q.getOptions()) {
                            System.out.println("  - " + opt.getOptionLabel() + ": " + opt.getOptionText());
                        }
                    }
                }
            }
            
            if (audio != null) {
                String audioUrl = storeFile(audio, "audio");
                dto.setAudioUrl(audioUrl);
                System.out.println("Audio stored: " + audioUrl);
            }
            if (image != null) {
                String imageUrl = storeFile(image, "images");
                dto.setImageUrl(imageUrl);
                System.out.println("Image stored: " + imageUrl);
            }
            
            // Get current user
            User currentUser = null;
            if (principal != null) {
                System.out.println("🔍 Looking up user: " + principal.getName());
                currentUser = userService.findByEmail(principal.getName()).orElse(null);
                if (currentUser == null) {
                    System.out.println("❌ User not found by email, trying username...");
                    currentUser = userService.findByUsername(principal.getName()).orElse(null);
                }
                System.out.println("Current user found: " + (currentUser != null ? currentUser.getEmail() + " (ID: " + currentUser.getId() + ")" : "null"));
            } else {
                System.out.println("❌ NO PRINCIPAL - User authentication failed!");
            }
            
            QuestionGroup created = questionGroupService.createGroupWithQuestions(dto, currentUser);
            System.out.println("✅ QuestionGroup created with ID: " + created.getGroupId() + 
                " | CreatedBy: " + (created.getCreatedBy() != null ? created.getCreatedBy().getEmail() : "null"));
            return ResponseEntity.ok(created);
        } catch (IOException e) {
            System.err.println("❌ IO Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.err.println("❌ General Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String storeFile(MultipartFile file, String subfolder) throws IOException {
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path folderPath = Paths.get(UPLOAD_ROOT, subfolder);
        Files.createDirectories(folderPath);
        Path filePath = folderPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + subfolder + "/" + filename;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Question Group Controller is working!");
    }
    
    @GetMapping("/my")
    public ResponseEntity<List<QuestionGroup>> getMyQuestionGroups(Principal principal) {
        try {
            System.out.println("🔍 Getting question groups for user: " + principal.getName());
            
            User currentUser = userService.findByEmail(principal.getName()).orElse(null);
            if (currentUser == null) {
                System.out.println("❌ User not found by email, trying username...");
                currentUser = userService.findByUsername(principal.getName()).orElse(null);
            }
            
            if (currentUser == null) {
                System.out.println("❌ User not found by email or username: " + principal.getName());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            
            System.out.println("✅ Found user: " + currentUser.getEmail() + " (ID: " + currentUser.getId() + ")");
            
            List<QuestionGroup> groups = questionGroupService.getGroupsByUser(currentUser);
            System.out.println("✅ Found " + groups.size() + " question groups for user: " + principal.getName());
            
            // Debug: Print group details
            for (QuestionGroup group : groups) {
                System.out.println("- Group ID: " + group.getGroupId() + 
                    ", Title: " + group.getTitle() + 
                    ", CreatedBy: " + (group.getCreatedBy() != null ? group.getCreatedBy().getEmail() : "null"));
            }
            
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            System.out.println("❌ Error getting user's question groups: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PostMapping("/test-json")
    public ResponseEntity<String> testJson(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok("JSON POST test successful: " + data.toString());
    }
    
    @GetMapping("/test-all")
    public ResponseEntity<String> testAll() {
        return ResponseEntity.ok("Test All endpoint is working!");
    }
    
    @GetMapping("/test-by-part/{partId}")
    public ResponseEntity<String> testByPart(@PathVariable Long partId) {
        return ResponseEntity.ok("Test By Part endpoint is working for part: " + partId);
    }
    
    @PostMapping("/add-test-data")
    public ResponseEntity<String> addTestData() {
        try {
            // Group 1: TOEIC Part 3 - Office Conversation
            QuestionGroupRequestDTO group1 = new QuestionGroupRequestDTO();
            group1.setTitle("TOEIC Part 3 - Office Conversation");
            group1.setType("LISTENING");
            group1.setContent("Listen to the conversation between two colleagues discussing a project deadline.");
            group1.setPartId(3L);
            
            List<QuestionRequestDTO> questions1 = Arrays.asList(
                createQuestion("What is the main topic of the conversation?", "A",
                    Arrays.asList(
                        createOption("A", "Project deadline"),
                        createOption("B", "Meeting schedule"),
                        createOption("C", "Budget planning"),
                        createOption("D", "Staff training")
                    )),
                createQuestion("When is the deadline mentioned?", "B",
                    Arrays.asList(
                        createOption("A", "Next Monday"),
                        createOption("B", "Next Friday"),
                        createOption("C", "Next month"),
                        createOption("D", "Next week")
                    )),
                createQuestion("What does the woman suggest?", "C",
                    Arrays.asList(
                        createOption("A", "Cancel the project"),
                        createOption("B", "Ask for more time"),
                        createOption("C", "Work overtime"),
                        createOption("D", "Hire more staff")
                    ))
            );
            group1.setQuestions(questions1);
            
            QuestionGroup created1 = questionGroupService.createGroupWithQuestions(group1);
            
            // Group 2: TOEIC Part 7 - Email Reading
            QuestionGroupRequestDTO group2 = new QuestionGroupRequestDTO();
            group2.setTitle("TOEIC Part 7 - Email Reading");
            group2.setType("READING");
            group2.setContent("Read the email about quarterly meeting rescheduling and answer questions.");
            group2.setPartId(7L);
            
            List<QuestionRequestDTO> questions2 = Arrays.asList(
                createQuestion("What is the purpose of this email?", "B",
                    Arrays.asList(
                        createOption("A", "To schedule a new meeting"),
                        createOption("B", "To reschedule an existing meeting"),
                        createOption("C", "To cancel a meeting"),
                        createOption("D", "To request attendance confirmation")
                    )),
                createQuestion("When was the meeting originally scheduled?", "A",
                    Arrays.asList(
                        createOption("A", "March 15th"),
                        createOption("B", "March 22nd"),
                        createOption("C", "March 8th"),
                        createOption("D", "March 29th")
                    ))
            );
            group2.setQuestions(questions2);
            
            QuestionGroup created2 = questionGroupService.createGroupWithQuestions(group2);
            
            // Group 3: TOEIC Part 5 - Grammar Practice
            QuestionGroupRequestDTO group3 = new QuestionGroupRequestDTO();
            group3.setTitle("TOEIC Part 5 - Grammar Practice");
            group3.setType("READING");
            group3.setContent("Complete the sentences by choosing the best option.");
            group3.setPartId(5L);
            
            List<QuestionRequestDTO> questions3 = Arrays.asList(
                createQuestion("The report must be submitted _____ Friday afternoon.", "C",
                    Arrays.asList(
                        createOption("A", "in"),
                        createOption("B", "on"),
                        createOption("C", "by"),
                        createOption("D", "at")
                    )),
                createQuestion("The new employee has been working here _____ six months.", "B",
                    Arrays.asList(
                        createOption("A", "since"),
                        createOption("B", "for"),
                        createOption("C", "during"),
                        createOption("D", "from")
                    )),
                createQuestion("Please make sure all documents are _____ before the meeting.", "A",
                    Arrays.asList(
                        createOption("A", "prepared"),
                        createOption("B", "preparing"),
                        createOption("C", "preparation"),
                        createOption("D", "prepare")
                    ))
            );
            group3.setQuestions(questions3);
            
            QuestionGroup created3 = questionGroupService.createGroupWithQuestions(group3);
            
            return ResponseEntity.ok("Test data added successfully! Created 3 question groups: " + 
                "Part 3 - Office Conversation, Part 7 - Email Reading, Part 5 - Grammar Practice");
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error adding test data: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<QuestionGroup>> getAllQuestionGroups() {
        try {
            List<QuestionGroup> groups = questionGroupService.getAllGroups();
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/by-part/{partId}")
    public ResponseEntity<List<QuestionGroup>> getQuestionGroupsByPart(@PathVariable Long partId) {
        try {
            List<QuestionGroup> groups = questionGroupService.getGroupsByPartId(partId);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/list")
    public ResponseEntity<List<QuestionGroup>> getAllGroups() {
        try {
            List<QuestionGroup> groups = questionGroupService.getAllGroups();
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/part/{partId}")
    public ResponseEntity<List<QuestionGroup>> getGroupsByPart(@PathVariable Long partId) {
        try {
            List<QuestionGroup> groups = questionGroupService.getGroupsByPartId(partId);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<QuestionGroup> getQuestionGroupById(@PathVariable Long id, Principal principal) {
        try {
            System.out.println("🔍 Getting question group by ID: " + id);
            
            QuestionGroup group = questionGroupService.getGroupById(id);
            if (group == null) {
                System.out.println("❌ Question group not found with ID: " + id);
                return ResponseEntity.notFound().build();
            }
            
            // Verify ownership for user's groups
            if (principal != null) {
                User currentUser = userService.findByEmail(principal.getName()).orElse(null);
                if (currentUser == null) {
                    currentUser = userService.findByUsername(principal.getName()).orElse(null);
                }
                
                // Allow access if user is the creator or if group has no creator (public)
                if (group.getCreatedBy() != null && currentUser != null && 
                    !group.getCreatedBy().getId().equals(currentUser.getId())) {
                    System.out.println("❌ Access denied. User " + principal.getName() + 
                        " cannot access group created by " + group.getCreatedBy().getEmail());
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
                }
            }
            
            System.out.println("✅ Found question group: " + group.getTitle());
            return ResponseEntity.ok(group);
        } catch (Exception e) {
            System.out.println("❌ Error getting question group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<QuestionGroup> updateQuestionGroup(
        @PathVariable Long id,
        @RequestPart("group") @Valid QuestionGroupRequestDTO dto,
        @RequestPart(value = "audio", required = false) MultipartFile audio,
        @RequestPart(value = "image", required = false) MultipartFile image,
        Principal principal
    ) {
        try {
            System.out.println("🔄 Updating question group ID: " + id);
            
            // Verify ownership
            QuestionGroup existingGroup = questionGroupService.getGroupById(id);
            if (existingGroup == null) {
                return ResponseEntity.notFound().build();
            }
            
            User currentUser = userService.findByEmail(principal.getName()).orElse(null);
            if (currentUser == null) {
                currentUser = userService.findByUsername(principal.getName()).orElse(null);
            }
            
            if (currentUser == null || 
                (existingGroup.getCreatedBy() != null && !existingGroup.getCreatedBy().getId().equals(currentUser.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            // Handle file uploads
            if (audio != null) {
                String audioUrl = storeFile(audio, "audio");
                dto.setAudioUrl(audioUrl);
            }
            if (image != null) {
                String imageUrl = storeFile(image, "images");
                dto.setImageUrl(imageUrl);
            }
            
            QuestionGroup updatedGroup = questionGroupService.updateGroup(id, dto, currentUser);
            System.out.println("✅ Updated question group: " + updatedGroup.getTitle());
            return ResponseEntity.ok(updatedGroup);
        } catch (Exception e) {
            System.out.println("❌ Error updating question group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestionGroup(@PathVariable Long id, Principal principal) {
        try {
            System.out.println("🗑️ Deleting question group ID: " + id);
            
            QuestionGroup group = questionGroupService.getGroupById(id);
            if (group == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify ownership
            User currentUser = userService.findByEmail(principal.getName()).orElse(null);
            if (currentUser == null) {
                currentUser = userService.findByUsername(principal.getName()).orElse(null);
            }
            
            if (currentUser == null || 
                (group.getCreatedBy() != null && !group.getCreatedBy().getId().equals(currentUser.getId()))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            questionGroupService.deleteGroup(id);
            System.out.println("✅ Deleted question group: " + group.getTitle());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("❌ Error deleting question group: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private QuestionRequestDTO createQuestion(String questionText, String correctOption, List<OptionRequestDTO> options) {
        QuestionRequestDTO question = new QuestionRequestDTO();
        question.setQuestionText(questionText);
        question.setCorrectOption(correctOption);
        question.setOptions(options);
        return question;
    }
    
    private OptionRequestDTO createOption(String label, String content) {
        OptionRequestDTO option = new OptionRequestDTO();
        option.setOptionLabel(label);
        option.setOptionText(content);
        return option;
    }
}