package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.QuestionCreateRequest;
import com.leenglish.toeic.dto.OptionCreateDTO;
import com.leenglish.toeic.service.QuestionBankService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/test-data")
public class TestDataController {

    @Autowired
    private QuestionBankService questionBankService;

    @PostMapping("/generate-sample-questions")
    public ResponseEntity<String> generateSampleQuestions() {
        try {
            // Generate enough questions for a full TOEIC test
            generatePart1Questions(); // 6 questions
            generatePart2Questions(); // 25 questions  
            generatePart5Questions(); // 30 questions
            generatePart6Questions(); // 16 questions
            generatePart7Questions(); // 54 questions
            
            return ResponseEntity.ok("Successfully generated sample questions for all parts!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private void generatePart1Questions() {
        String[] questions = {
            "What is the man doing in the picture?",
            "Where is this scene taking place?", 
            "What are the people in the image doing?",
            "What can you see in the background?",
            "What is the woman holding?",
            "How many people are in the picture?"
        };
        
        for (int i = 0; i < questions.length; i++) {
            addQuestion(1, questions[i], "A", 
                "Option A for question " + (i+1), 
                "Option B for question " + (i+1),
                "Option C for question " + (i+1), 
                "Option D for question " + (i+1));
        }
    }

    private void generatePart2Questions() {
        String[] questions = {
            "When will the meeting start?", "Where did you put the report?", "Who is in charge of this project?",
            "How long will the presentation take?", "What time does the store close?", "Why was the event cancelled?",
            "Which department handles customer service?", "How much does this service cost?", "When is the deadline?",
            "Where should I submit the application?", "Who approved this budget?", "What's the weather like today?",
            "How many participants registered?", "Which floor is the conference room on?", "When will you return?",
            "Where can I find the restroom?", "Who designed this website?", "What's included in the package?",
            "How often do you travel for work?", "Which train should I take?", "When does the sale end?",
            "Where did you buy that laptop?", "Who's responsible for quality control?", "What's your email address?",
            "How can I contact customer support?"
        };
        
        for (int i = 0; i < questions.length; i++) {
            addQuestion(2, questions[i], "B", 
                "At 9 AM", "In the conference room", "Next Monday", "By email");
        }
    }

    private void generatePart5Questions() {
        String[] questions = {
            "The report must be submitted _____ Friday afternoon.",
            "All employees are _____ to attend the meeting.",
            "The new software will _____ productivity significantly.",
            "We need to _____ our marketing strategy.",
            "The contract _____ signed by both parties.",
            "Please _____ the attached document carefully.",
            "The company has _____ a new policy.",
            "Our sales team _____ exceeded their targets.",
            "The presentation was _____ informative.",
            "We should _____ this issue immediately.",
            "The deadline has been _____ to next month.",
            "All applications must be _____ by email.",
            "The meeting room is _____ on the third floor.",
            "Please _____ your password regularly.",
            "The project _____ completed on time.",
            "We need to _____ more staff members.",
            "The budget _____ approved by management.",
            "Please _____ the form completely.",
            "The conference will _____ place next week.",
            "All visitors must _____ at reception.",
            "The system _____ down yesterday.",
            "We should _____ a backup plan.",
            "The equipment _____ installed properly.",
            "Please _____ the safety instructions.",
            "The proposal _____ submitted yesterday.",
            "We need to _____ our expenses.",
            "The office _____ closed on weekends.",
            "Please _____ your seat belt.",
            "The training _____ mandatory for all staff.",
            "We should _____ the results carefully."
        };
        
        String[][] options = {
            {"in", "on", "by", "at"}, {"required", "requiring", "requirement", "require"},
            {"improve", "improved", "improving", "improvement"}, {"review", "reviewed", "reviewing", "reviewer"},
            {"was", "were", "is", "are"}, {"read", "reading", "reads", "reader"},
            {"implemented", "implementing", "implement", "implementation"}, {"has", "have", "had", "having"},
            {"very", "much", "more", "most"}, {"address", "addressed", "addressing", "addresses"},
            {"extended", "extending", "extend", "extension"}, {"submitted", "submitting", "submit", "submission"},
            {"located", "locating", "locate", "location"}, {"change", "changed", "changing", "changes"},
            {"was", "were", "is", "are"}, {"hire", "hired", "hiring", "hires"},
            {"was", "were", "is", "are"}, {"fill", "filled", "filling", "fills"},
            {"take", "took", "taking", "taken"}, {"register", "registered", "registering", "registration"},
            {"went", "goes", "going", "gone"}, {"develop", "developed", "developing", "development"},
            {"was", "were", "is", "are"}, {"follow", "followed", "following", "follows"},
            {"was", "were", "is", "are"}, {"monitor", "monitored", "monitoring", "monitors"},
            {"is", "are", "was", "were"}, {"fasten", "fastened", "fastening", "fastens"},
            {"is", "are", "was", "were"}, {"analyze", "analyzed", "analyzing", "analysis"}
        };
        
        String[] correctAnswers = {"C", "A", "A", "A", "A", "A", "A", "A", "A", "A", 
                                  "A", "A", "A", "A", "A", "A", "A", "A", "A", "A",
                                  "A", "A", "A", "A", "A", "A", "A", "A", "A", "A"};
        
        for (int i = 0; i < questions.length; i++) {
            addQuestion(5, questions[i], correctAnswers[i], 
                options[i][0], options[i][1], options[i][2], options[i][3]);
        }
    }

    private void generatePart6Questions() {
        for (int i = 1; i <= 16; i++) {
            addQuestion(6, "Choose the best word to complete the text passage " + i + ".", "B",
                "Option A", "Correct option B", "Option C", "Option D");
        }
    }

    private void generatePart7Questions() {
        for (int i = 1; i <= 54; i++) {
            addQuestion(7, "According to the passage, what is the main purpose of " + i + "?", "C",
                "Option A", "Option B", "Correct option C", "Option D");
        }
    }

    private void addQuestion(int partNumber, String questionText, String correctOption,
                           String optA, String optB, String optC, String optD) {
        try {
            // Generate placeholder URLs based on part number
            String audioUrl = null;
            String imageUrl = null;
            
            // Parts that typically need audio
            if (partNumber == 1 || partNumber == 2 || partNumber == 3 || partNumber == 4) {
                audioUrl = "/uploads/audio/sample_part" + partNumber + "_audio.mp3";
            }
            
            // Parts that typically need images  
            if (partNumber == 1 || partNumber == 6 || partNumber == 7) {
                imageUrl = "/uploads/images/sample_part" + partNumber + "_image.jpg";
            }
            
            List<OptionCreateDTO> options = Arrays.asList(
                new OptionCreateDTO("A", optA),
                new OptionCreateDTO("B", optB),
                new OptionCreateDTO("C", optC),
                new OptionCreateDTO("D", optD)
            );

            QuestionCreateRequest request = new QuestionCreateRequest(
                partNumber, questionText, audioUrl, imageUrl, correctOption, options);

            questionBankService.addQuestionToBank(request);
        } catch (Exception e) {
            System.err.println("Failed to add question: " + e.getMessage());
        }
    }

    @PostMapping("/generate-sample-files")
    public ResponseEntity<String> generateSampleFiles() {
        try {
            createSampleAudioFiles();
            createSampleImageFiles();
            return ResponseEntity.ok("Sample audio and image files created successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating files: " + e.getMessage());
        }
    }

    private void createSampleAudioFiles() throws IOException {
        String[] audioFiles = {
            "sample_part1_audio.mp3", "sample_part2_audio.mp3", 
            "sample_part3_audio.mp3", "sample_part4_audio.mp3"
        };
        
        Path audioDir = Paths.get("uploads", "audio");
        Files.createDirectories(audioDir);
        
        for (String filename : audioFiles) {
            Path audioFile = audioDir.resolve(filename);
            if (!Files.exists(audioFile)) {
                // Create a small placeholder file
                Files.write(audioFile, "Sample audio content".getBytes());
            }
        }
    }

    private void createSampleImageFiles() throws IOException {
        String[] imageFiles = {
            "sample_part1_image.jpg", "sample_part6_image.jpg", 
            "sample_part7_image.jpg"
        };
        
        Path imageDir = Paths.get("uploads", "images");
        Files.createDirectories(imageDir);
        
        for (String filename : imageFiles) {
            Path imageFile = imageDir.resolve(filename);
            if (!Files.exists(imageFile)) {
                // Create a small placeholder file
                Files.write(imageFile, "Sample image content".getBytes());
            }
        }
    }

    @PostMapping("/generate-complete-sample-data")
    public ResponseEntity<String> generateCompleteSampleData() {
        try {
            // Step 1: Create sample files first
            createSampleAudioFiles();
            createSampleImageFiles();
            
            // Step 2: Generate questions with proper file references
            generatePart1Questions(); // 6 questions with audio + image
            generatePart2Questions(); // 25 questions with audio
            generatePart5Questions(); // 30 questions (text only)
            generatePart6Questions(); // 16 questions with image
            generatePart7Questions(); // 54 questions with image
            
            return ResponseEntity.ok("Complete sample data generated successfully! " +
                "Created audio files, image files, and " + (6+25+30+16+54) + " questions.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
