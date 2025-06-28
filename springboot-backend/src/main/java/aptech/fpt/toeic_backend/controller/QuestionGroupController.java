/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;

/**
 *
 * @author caong
 */

import aptech.fpt.toeic_backend.dto.QuestionGroupRequestDTO;
import aptech.fpt.toeic_backend.model.QuestionGroup;
import aptech.fpt.toeic_backend.service.QuestionGroupService;
import jakarta.validation.Valid;
import java.io.IOException;
import java.nio.file.*;
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

    private static final String UPLOAD_ROOT = "uploads";

    @PostMapping(value = "/create-with-questions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<QuestionGroup> createGroupWithQuestions(
        @RequestPart("group") @Valid QuestionGroupRequestDTO dto,
        @RequestPart(value = "audio", required = false) MultipartFile audio,
        @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        try {
            if (audio != null) {
                String audioUrl = storeFile(audio, "audio");
                dto.setAudioUrl(audioUrl);
            }
            if (image != null) {
                String imageUrl = storeFile(image, "images");
                dto.setImageUrl(imageUrl);
            }
            QuestionGroup created = questionGroupService.createGroupWithQuestions(dto);
            return ResponseEntity.ok(created);
        } catch (IOException e) {
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
}