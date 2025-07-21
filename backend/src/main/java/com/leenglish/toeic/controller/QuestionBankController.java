/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.controller;

// QuestionBankController.java (updated with folder-based file storage)

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.leenglish.toeic.dto.QuestionCreateRequest;
import com.leenglish.toeic.dto.OptionCreateDTO;
import com.leenglish.toeic.dto.QuestionBankListDto;
import com.leenglish.toeic.dto.QuestionDetailDto;
import com.leenglish.toeic.domain.QuestionTest;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.service.QuestionBankService;
import com.leenglish.toeic.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/question-bank")
public class QuestionBankController {

    private final QuestionBankService service;
    private final UserService userService;
    private static final String UPLOAD_ROOT = "uploads";

    public QuestionBankController(QuestionBankService service, UserService userService) {
        this.service = service;
        this.userService = userService;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> add(
            @RequestPart("question") @Valid QuestionCreateRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio) {
        try {
            // ✅ Get current authenticated user
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User currentUser = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String imageUrl = (image != null) ? storeFile(image, "images") : null;
            String audioUrl = (audio != null) ? storeFile(audio, "audio") : null;

            QuestionCreateRequest finalReq = new QuestionCreateRequest(
                    req.partNumber(),
                    req.questionText(),
                    audioUrl,
                    imageUrl,
                    req.correctOptionLabel(),
                    req.options());

            service.addQuestionToBank(finalReq, currentUser); // ✅ Pass user
            return ResponseEntity.ok().build();

        } catch (IOException e) {
            return ResponseEntity.status(500).build();
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
        return ResponseEntity.ok("Question Bank Controller is working!");
    }

    @PostMapping("/test-json")
    public ResponseEntity<String> testJson(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok("JSON POST test successful: " + data.toString());
    }

    @PostMapping(value = "/debug-multipart")
    public ResponseEntity<String> debugMultipart(HttpServletRequest request) {
        String contentType = request.getContentType();
        return ResponseEntity.ok("Content-Type received: " + contentType);
    }

    @PostMapping(value = "/add-simple", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addSimple(@RequestPart("data") String data) {
        return ResponseEntity.ok("Received: " + data);
    }

    @PostMapping(value = "/add-test", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> addTest(
            @RequestPart("question") String questionJson,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio) {
        return ResponseEntity.ok("Question JSON: " + questionJson +
                ", Image: " + (image != null ? image.getOriginalFilename() : "none") +
                ", Audio: " + (audio != null ? audio.getOriginalFilename() : "none"));
    }

    // @PostMapping("/add-real-data") // DISABLED to prevent duplicates
    @GetMapping("/add-real-data-disabled")
    public ResponseEntity<String> addRealDataDisabled() {
        return ResponseEntity.ok("This endpoint is disabled to prevent duplicate data. Use /add instead.");
    }

    private QuestionCreateRequest createSampleQuestion(int partNumber, String questionText,
            String correctOption, String optA, String optB, String optC, String optD) {

        List<OptionCreateDTO> options = Arrays.asList(
                new OptionCreateDTO("A", optA),
                new OptionCreateDTO("B", optB),
                new OptionCreateDTO("C", optC),
                new OptionCreateDTO("D", optD));

        return new QuestionCreateRequest(partNumber, questionText, null, null, correctOption, options);
    }

    @GetMapping("/list")
    public ResponseEntity<List<QuestionBankListDto>> getAllQuestions() {
        try {
            List<QuestionBankListDto> questions = service.getQuestionList(null); // Get all questions
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuestionBankListDto>> getMyQuestions() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User currentUser = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<QuestionBankListDto> questions = service.getMyQuestions(currentUser);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/part/{partNumber}")
    public ResponseEntity<List<QuestionTest>> getQuestionsByPart(@PathVariable Integer partNumber) {
        try {
            List<QuestionTest> questions = service.findByPartNumber(partNumber);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDetailDto> getQuestionById(@PathVariable Long id) {
        try {
            QuestionDetailDto question = service.getQuestionByQuestionId(id);
            if (question == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(question);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateQuestion(
            @PathVariable Long id,
            @RequestPart("question") @Valid QuestionCreateRequest req,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User currentUser = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String imageUrl = (image != null) ? storeFile(image, "images") : req.imageUrl();
            String audioUrl = (audio != null) ? storeFile(audio, "audio") : req.audioUrl();

            QuestionCreateRequest finalReq = new QuestionCreateRequest(
                    req.partNumber(),
                    req.questionText(),
                    audioUrl,
                    imageUrl,
                    req.correctOptionLabel(),
                    req.options());

            service.updateQuestion(id, finalReq, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating question");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();
            User currentUser = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            service.deleteQuestion(id, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting question");
        }
    }
}
