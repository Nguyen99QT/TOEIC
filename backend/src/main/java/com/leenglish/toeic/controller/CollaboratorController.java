package com.leenglish.toeic.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.dto.LessonDto;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.security.UserDetailsImpl;
import com.leenglish.toeic.service.LessonService;

@RestController
@RequestMapping("/api/collaborator")
@CrossOrigin(origins = "*")
public class CollaboratorController {

    @Autowired
    private LessonService lessonService;

    /**
     * Get all lessons created by collaborators
     */
    @GetMapping("/lessons")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getAllCollaboratorLessons() {
        try {
            List<LessonDto> lessons = lessonService.getAllLessonsAsDto();

            System.out.println("✅ Retrieved " + lessons.size() + " collaborator lessons");
            return ResponseEntity.ok(new ApiResponse<>(true, "Lessons retrieved successfully", lessons));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving collaborator lessons: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving lessons: " + e.getMessage(), null));
        }
    }

    /**
     * Get a specific lesson by ID for collaborators
     */
    @GetMapping("/lessons/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> getCollaboratorLesson(@PathVariable Long id) {
        try {
            return lessonService.getLessonById(id)
                    .map(lesson -> {
                        LessonDto lessonDto = lessonService.convertToDto(lesson);
                        System.out.println("✅ Retrieved collaborator lesson: " + lessonDto.getTitle());
                        return ResponseEntity.ok(new ApiResponse<>(true, "Lesson retrieved successfully", lessonDto));
                    })
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new ApiResponse<>(false, "Lesson not found", null)));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving collaborator lesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving lesson: " + e.getMessage(), null));
        }
    }

    /**
     * Create a new lesson as a collaborator
     */
    @PostMapping("/lessons")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> createCollaboratorLesson(
            @RequestBody LessonDto lessonDto,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Set the creator information
            lessonDto.setCreatedBy(userDetails.getUsername());

            System.out.println("📝 Creating new lesson: " + lessonDto.getTitle() + " by " + userDetails.getUsername());

            LessonDto createdLesson = lessonService.createLesson(lessonDto);

            System.out.println("✅ Lesson created successfully: " + createdLesson.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Lesson created successfully", createdLesson));

        } catch (Exception e) {
            System.err.println("❌ Error creating collaborator lesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating lesson: " + e.getMessage(), null));
        }
    }

    /**
     * Update an existing lesson as a collaborator
     */
    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> updateCollaboratorLesson(
            @PathVariable Long id,
            @RequestBody LessonDto lessonDto,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("📝 Updating lesson ID: " + id + " by " + userDetails.getUsername());
            System.out.println("📝 New lesson data: " + lessonDto.getTitle());

            // Check if lesson exists
            if (!lessonService.getLessonById(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Lesson not found", null));
            }

            // Set the updater information
            lessonDto.setUpdatedBy(userDetails.getUsername());

            LessonDto updatedLesson = lessonService.updateLesson(id, lessonDto);

            System.out.println("✅ Lesson updated successfully: " + updatedLesson.getTitle());
            return ResponseEntity.ok(new ApiResponse<>(true, "Lesson updated successfully", updatedLesson));

        } catch (Exception e) {
            System.err.println("❌ Error updating collaborator lesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating lesson: " + e.getMessage(), null));
        }
    }

    /**
     * Delete a lesson as a collaborator
     */
    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCollaboratorLesson(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("🗑️ Deleting lesson ID: " + id + " by " + userDetails.getUsername());

            // Check if lesson exists
            if (!lessonService.getLessonById(id).isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Lesson not found", null));
            }

            lessonService.deleteLesson(id);

            System.out.println("✅ Lesson deleted successfully: " + id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lesson deleted successfully", "Lesson ID: " + id));

        } catch (Exception e) {
            System.err.println("❌ Error deleting collaborator lesson: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error deleting lesson: " + e.getMessage(), null));
        }
    }

    /**
     * Get lessons by difficulty level for collaborators
     */
    @GetMapping("/lessons/difficulty/{difficulty}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessonsByDifficulty(@PathVariable String difficulty) {
        try {
            List<LessonDto> lessons = lessonService.getLessonsByDifficulty(difficulty);

            System.out.println("✅ Retrieved " + lessons.size() + " lessons with difficulty: " + difficulty);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lessons retrieved successfully", lessons));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving lessons by difficulty: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving lessons: " + e.getMessage(), null));
        }
    }

    /**
     * Get lessons by type for collaborators
     */
    @GetMapping("/lessons/type/{type}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessonsByType(@PathVariable String type) {
        try {
            List<LessonDto> lessons = lessonService.getLessonsByType(type);

            System.out.println("✅ Retrieved " + lessons.size() + " lessons with type: " + type);
            return ResponseEntity.ok(new ApiResponse<>(true, "Lessons retrieved successfully", lessons));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving lessons by type: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving lessons: " + e.getMessage(), null));
        }
    }

    /**
     * Get dashboard statistics for collaborators
     */
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCollaboratorDashboardStats(
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Get basic stats
            List<LessonDto> allLessons = lessonService.getAllLessonsAsDto();
            long totalLessons = allLessons.size();

            // Count lessons by difficulty
            long beginnerCount = allLessons.stream()
                    .filter(lesson -> "BEGINNER".equalsIgnoreCase(lesson.getDifficulty()))
                    .count();
            long intermediateCount = allLessons.stream()
                    .filter(lesson -> "INTERMEDIATE".equalsIgnoreCase(lesson.getDifficulty()))
                    .count();
            long advancedCount = allLessons.stream()
                    .filter(lesson -> "ADVANCED".equalsIgnoreCase(lesson.getDifficulty()))
                    .count();

            Map<String, Object> stats = Map.of(
                    "totalLessons", totalLessons,
                    "beginnerLessons", beginnerCount,
                    "intermediateLessons", intermediateCount,
                    "advancedLessons", advancedCount,
                    "collaborator", userDetails.getUsername());

            System.out.println("✅ Dashboard stats retrieved for: " + userDetails.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(true, "Dashboard stats retrieved successfully", stats));

        } catch (Exception e) {
            System.err.println("❌ Error retrieving dashboard stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving dashboard stats: " + e.getMessage(), null));
        }
    }

    /**
     * Upload image for lesson
     */
    @PostMapping("/lessons/{id}/upload-image")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadLessonImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile imageFile,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("📸 Uploading image for lesson ID: " + id + " by " + userDetails.getUsername());

            // Validate file
            if (imageFile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Please select an image file", null));
            }

            // Check file type
            String contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Only image files are allowed", null));
            }

            // Create images directory if it doesn't exist
            Path imagesDir = Paths.get("images");
            if (!Files.exists(imagesDir)) {
                Files.createDirectories(imagesDir);
            }

            // Generate unique filename
            String originalFileName = imageFile.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : ".jpg";
            String fileName = "lesson_" + id + "_" + System.currentTimeMillis() + fileExtension;

            Path filePath = imagesDir.resolve(fileName);

            // Save file
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update lesson with image URL
            String imageUrl = "/images/" + fileName;
            Map<String, String> result = new HashMap<>();
            result.put("imageUrl", imageUrl);
            result.put("fileName", fileName);
            result.put("message", "Image uploaded successfully");

            System.out.println("✅ Image uploaded successfully: " + imageUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Image uploaded successfully", result));

        } catch (IOException e) {
            System.err.println("❌ Error uploading image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to upload image: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("❌ Error uploading image: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error uploading image: " + e.getMessage(), null));
        }
    }

    /**
     * Upload audio for lesson
     */
    @PostMapping("/lessons/{id}/upload-audio")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadLessonAudio(
            @PathVariable Long id,
            @RequestParam("audio") MultipartFile audioFile,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("🎵 Uploading audio for lesson ID: " + id + " by " + userDetails.getUsername());

            // Validate file
            if (audioFile.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Please select an audio file", null));
            }

            // Check file type
            String contentType = audioFile.getContentType();
            if (contentType == null || !contentType.startsWith("audio/")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new ApiResponse<>(false, "Only audio files are allowed", null));
            }

            // Create audio directory if it doesn't exist
            Path audioDir = Paths.get("audio");
            if (!Files.exists(audioDir)) {
                Files.createDirectories(audioDir);
            }

            // Generate unique filename
            String originalFileName = audioFile.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : ".mp3";
            String fileName = "lesson_" + id + "_" + System.currentTimeMillis() + fileExtension;

            Path filePath = audioDir.resolve(fileName);

            // Save file
            Files.copy(audioFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update lesson with audio URL
            String audioUrl = "/audio/" + fileName;
            Map<String, String> result = new HashMap<>();
            result.put("audioUrl", audioUrl);
            result.put("fileName", fileName);
            result.put("message", "Audio uploaded successfully");

            System.out.println("✅ Audio uploaded successfully: " + audioUrl);
            return ResponseEntity.ok(new ApiResponse<>(true, "Audio uploaded successfully", result));

        } catch (IOException e) {
            System.err.println("❌ Error uploading audio: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to upload audio: " + e.getMessage(), null));
        } catch (Exception e) {
            System.err.println("❌ Error uploading audio: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error uploading audio: " + e.getMessage(), null));
        }
    }

    /**
     * Update lesson with uploaded files
     */
    @PutMapping("/lessons/{id}/update-media")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> updateLessonMedia(
            @PathVariable Long id,
            @RequestBody Map<String, String> mediaData,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("📝 Updating lesson media for ID: " + id + " by " + userDetails.getUsername());

            // Get existing lesson
            java.util.Optional<Lesson> lessonOpt = lessonService.getLessonById(id);
            if (lessonOpt.isPresent()) {
                try {
                    LessonDto lessonDto = lessonService.convertToDto(lessonOpt.get());

                    // Update image URL if provided
                    if (mediaData.containsKey("imageUrl")) {
                        lessonDto.setImageUrl(mediaData.get("imageUrl"));
                    }

                    // Update audio URL if provided
                    if (mediaData.containsKey("audioUrl")) {
                        lessonDto.setAudioUrl(mediaData.get("audioUrl"));
                    }

                    lessonDto.setUpdatedBy(userDetails.getUsername());
                    LessonDto updatedLesson = lessonService.updateLesson(id, lessonDto);

                    System.out.println("✅ Lesson media updated successfully: " + updatedLesson.getTitle());
                    return ResponseEntity
                            .ok(new ApiResponse<>(true, "Lesson media updated successfully", updatedLesson));
                } catch (Exception e) {
                    System.err.println("❌ Error updating lesson media: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new ApiResponse<>(false, "Error updating lesson media: " + e.getMessage(), null));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Lesson not found", null));
            }

        } catch (Exception e) {
            System.err.println("❌ Error updating lesson media: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating lesson media: " + e.getMessage(), null));
        }
    }

    /**
     * Health check endpoint for collaborator API
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Collaborator API is healthy", "OK"));
    }
}
