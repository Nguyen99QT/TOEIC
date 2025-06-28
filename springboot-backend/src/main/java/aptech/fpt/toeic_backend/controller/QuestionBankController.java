/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;

// QuestionBankController.java (updated with folder-based file storage)

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import aptech.fpt.toeic_backend.dto.QuestionCreateRequest;
import aptech.fpt.toeic_backend.service.QuestionBankService;

import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/question-bank")
public class QuestionBankController {

    private final QuestionBankService service;
    private static final String UPLOAD_ROOT = "uploads";

    public QuestionBankController(QuestionBankService service) {
        this.service = service;
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> add(
        @RequestPart("question") @Valid QuestionCreateRequest req,
        @RequestPart(value = "image", required = false) MultipartFile image,
        @RequestPart(value = "audio", required = false) MultipartFile audio
    ) {
        try {
            String imageUrl = (image != null) ? storeFile(image, "images") : null;
            String audioUrl = (audio != null) ? storeFile(audio, "audio") : null;

            QuestionCreateRequest finalReq = new QuestionCreateRequest(
                req.partNumber(),
                req.questionText(),
                audioUrl,
                imageUrl,
                req.correctOptionLabel(),
                req.options()
            );

            service.addQuestionToBank(finalReq);
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
}
