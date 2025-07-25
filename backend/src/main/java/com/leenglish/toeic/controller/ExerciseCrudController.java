package com.leenglish.toeic.controller;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.ExerciseDto;
import com.leenglish.toeic.service.ExerciseService;
import com.leenglish.toeic.service.FileUploadService;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * CRUD Controller cho Exercise với khả năng upload file
 */
@Slf4j
@RestController
@RequestMapping("/api/exercises-crud")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExerciseCrudController {

    private final ExerciseService exerciseService;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepository;

    // ========== READ OPERATIONS ==========

    /**
     * Get all exercises with pagination and filtering
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ExerciseDto>>> getAllExercises(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search) {
        try {
            log.info("🔍 Fetching exercises - page: {}, size: {}, type: {}, difficulty: {}, search: {}",
                    page, size, type, difficulty, search);

            List<Exercise> exercises = exerciseService.getAllExercises();

            // Apply filters
            List<Exercise> filteredExercises = exercises.stream()
                    .filter(ex -> ex.getIsActive() != null && ex.getIsActive())
                    .filter(ex -> type == null || type.equals(ex.getType()))
                    .filter(ex -> difficulty == null || difficulty.equals(ex.getDifficulty())
                            || difficulty.equals(ex.getDifficultyLevel()))
                    .filter(ex -> search == null ||
                            (ex.getTitle() != null && ex.getTitle().toLowerCase().contains(search.toLowerCase())) ||
                            (ex.getDescription() != null
                                    && ex.getDescription().toLowerCase().contains(search.toLowerCase())))
                    .collect(Collectors.toList());

            // Apply pagination
            int start = page * size;
            int end = Math.min(start + size, filteredExercises.size());
            List<Exercise> paginatedExercises = filteredExercises.subList(start, end);

            List<ExerciseDto> exerciseDtos = paginatedExercises.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(ApiResponse.success("Exercises retrieved successfully", exerciseDtos));
        } catch (Exception e) {
            log.error("❌ Error fetching exercises", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch exercises: " + e.getMessage()));
        }
    }

    /**
     * Get exercise by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ExerciseDto>> getExerciseById(@PathVariable Long id) {
        try {
            log.info("🔍 Fetching exercise with ID: {}", id);

            Optional<Exercise> exercise = exerciseService.getExerciseById(id);
            if (exercise.isPresent()) {
                ExerciseDto exerciseDto = convertToDto(exercise.get());
                return ResponseEntity.ok(ApiResponse.success("Exercise retrieved successfully", exerciseDto));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Exercise not found with ID: " + id));
            }
        } catch (Exception e) {
            log.error("❌ Error fetching exercise with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch exercise: " + e.getMessage()));
        }
    }

    // ========== CREATE OPERATIONS ==========

    /**
     * Create new exercise
     */
    @PostMapping
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExerciseDto>> createExercise(
            @Valid @RequestBody ExerciseDto exerciseDto,
            Authentication auth) {
        try {
            log.info("📝 Creating new exercise: {} by {}", exerciseDto.getTitle(), auth.getName());

            Exercise exercise = convertToEntity(exerciseDto);
            exercise.setCreatedAt(LocalDateTime.now());
            exercise.setUpdatedAt(LocalDateTime.now());
            exercise.setIsActive(true);

            Exercise savedExercise = exerciseService.createExercise(exercise);
            ExerciseDto responseDto = convertToDto(savedExercise);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Exercise created successfully", responseDto));
        } catch (Exception e) {
            log.error("❌ Error creating exercise", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create exercise: " + e.getMessage()));
        }
    }

    /**
     * Create exercise with file uploads
     */
    @PostMapping("/with-files")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExerciseDto>> createExerciseWithFiles(
            @RequestParam("exerciseData") String exerciseJson,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
            Authentication auth) {
        try {
            log.info("📝 Creating exercise with files by {}", auth.getName());

            // Parse JSON data
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ExerciseDto exerciseDto = mapper.readValue(exerciseJson, ExerciseDto.class);

            // Handle file uploads
            if (imageFile != null && !imageFile.isEmpty()) {
                String imageUrl = fileUploadService.uploadImage(imageFile);
                exerciseDto.setImageUrl(imageUrl);
            }

            if (audioFile != null && !audioFile.isEmpty()) {
                String audioUrl = fileUploadService.uploadAudio(audioFile);
                exerciseDto.setAudioUrl(audioUrl);
            }

            // Create exercise
            Exercise exercise = convertToEntity(exerciseDto);
            exercise.setCreatedAt(LocalDateTime.now());
            exercise.setUpdatedAt(LocalDateTime.now());
            exercise.setIsActive(true);

            Exercise savedExercise = exerciseService.createExercise(exercise);
            ExerciseDto responseDto = convertToDto(savedExercise);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Exercise with files created successfully", responseDto));
        } catch (Exception e) {
            log.error("❌ Error creating exercise with files", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create exercise with files: " + e.getMessage()));
        }
    }

    // ========== UPDATE OPERATIONS ==========

    /**
     * Update exercise
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExerciseDto>> updateExercise(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseDto exerciseDto,
            Authentication auth) {
        try {
            log.info("✏️ Updating exercise {} by {}", id, auth.getName());

            Optional<Exercise> existingExercise = exerciseService.getExerciseById(id);
            if (!existingExercise.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Exercise not found with ID: " + id));
            }

            Exercise exercise = existingExercise.get();
            updateExerciseFromDto(exercise, exerciseDto);
            exercise.setUpdatedAt(LocalDateTime.now());

            // Note: We're not handling file updates here - use separate endpoints for that
            Exercise updatedExercise = exerciseService.createExercise(exercise); // Using createExercise as it handles
                                                                                 // save
            ExerciseDto responseDto = convertToDto(updatedExercise);

            return ResponseEntity.ok(ApiResponse.success("Exercise updated successfully", responseDto));
        } catch (Exception e) {
            log.error("❌ Error updating exercise {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update exercise: " + e.getMessage()));
        }
    }

    /**
     * Update exercise with file uploads
     */
    @PutMapping("/{id}/with-files")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExerciseDto>> updateExerciseWithFiles(
            @PathVariable Long id,
            @RequestParam("exerciseData") String exerciseJson,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile,
            @RequestParam(value = "audioFile", required = false) MultipartFile audioFile,
            Authentication auth) {
        try {
            log.info("✏️ Updating exercise {} with files by {}", id, auth.getName());

            Optional<Exercise> existingExercise = exerciseService.getExerciseById(id);
            if (!existingExercise.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Exercise not found with ID: " + id));
            }

            Exercise exercise = existingExercise.get();

            // Parse JSON data
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            ExerciseDto exerciseDto = mapper.readValue(exerciseJson, ExerciseDto.class);

            // Handle file uploads (delete old files if new ones are uploaded)
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if exists
                if (exercise.getImageUrl() != null) {
                    fileUploadService.deleteFile(exercise.getImageUrl());
                }
                String imageUrl = fileUploadService.uploadImage(imageFile);
                exercise.setImageUrl(imageUrl);
            }

            if (audioFile != null && !audioFile.isEmpty()) {
                // Delete old audio if exists
                if (exercise.getAudioUrl() != null) {
                    fileUploadService.deleteFile(exercise.getAudioUrl());
                }
                String audioUrl = fileUploadService.uploadAudio(audioFile);
                exercise.setAudioUrl(audioUrl);
            }

            // Update other fields
            updateExerciseFromDto(exercise, exerciseDto);
            exercise.setUpdatedAt(LocalDateTime.now());

            Exercise updatedExercise = exerciseService.createExercise(exercise);
            ExerciseDto responseDto = convertToDto(updatedExercise);

            return ResponseEntity.ok(ApiResponse.success("Exercise with files updated successfully", responseDto));
        } catch (Exception e) {
            log.error("❌ Error updating exercise {} with files", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update exercise with files: " + e.getMessage()));
        }
    }

    // ========== DELETE OPERATIONS ==========

    /**
     * Delete exercise (soft delete)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteExercise(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting exercise {} by {}", id, auth.getName());

            Optional<Exercise> existingExercise = exerciseService.getExerciseById(id);
            if (!existingExercise.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Exercise not found with ID: " + id));
            }

            Exercise exercise = existingExercise.get();

            // Delete associated files
            if (exercise.getImageUrl() != null) {
                fileUploadService.deleteFile(exercise.getImageUrl());
            }
            if (exercise.getAudioUrl() != null) {
                fileUploadService.deleteFile(exercise.getAudioUrl());
            }

            // Soft delete
            exercise.setIsActive(false);
            exercise.setUpdatedAt(LocalDateTime.now());
            exerciseService.createExercise(exercise);

            return ResponseEntity.ok(ApiResponse.success("Exercise deleted successfully", null));
        } catch (Exception e) {
            log.error("❌ Error deleting exercise {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete exercise: " + e.getMessage()));
        }
    }

    // ========== HELPER METHODS ==========

    private ExerciseDto convertToDto(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setTitle(exercise.getTitle());
        dto.setDescription(exercise.getDescription());
        dto.setType(exercise.getType());
        dto.setDifficulty(exercise.getDifficulty() != null ? exercise.getDifficulty() : exercise.getDifficultyLevel());
        dto.setTimeLimit(exercise.getTimeLimitSeconds() != null ? exercise.getTimeLimitSeconds() / 60 : null);
        dto.setTotalQuestions(exercise.getQuestions() != null ? exercise.getQuestions().size() : 0);
        dto.setIsActive(exercise.getIsActive());
        dto.setCreatedAt(exercise.getCreatedAt());
        dto.setUpdatedAt(exercise.getUpdatedAt());
        dto.setPoints(exercise.getPoints());

        // Set additional fields for frontend compatibility
        dto.setDuration(dto.getTimeLimit());
        dto.setQuestionsCount(dto.getTotalQuestions());
        dto.setIsCompleted(false); // TODO: Implement user progress tracking
        dto.setIsLocked(false); // TODO: Implement locking logic

        // Add image and audio URL
        dto.setImageUrl(exercise.getImageUrl());
        dto.setAudioUrl(exercise.getAudioUrl());

        return dto;
    }

    private Exercise convertToEntity(ExerciseDto dto) {
        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setTitle(dto.getTitle());
        exercise.setDescription(dto.getDescription());
        exercise.setType(dto.getType());
        exercise.setDifficulty(dto.getDifficulty());
        exercise.setDifficultyLevel(dto.getDifficulty()); // Set both fields
        exercise.setTimeLimitSeconds(dto.getTimeLimit() != null ? dto.getTimeLimit() * 60 : null);
        exercise.setPoints(dto.getPoints());
        exercise.setImageUrl(dto.getImageUrl());
        exercise.setAudioUrl(dto.getAudioUrl());
        exercise.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        return exercise;
    }

    private void updateExerciseFromDto(Exercise exercise, ExerciseDto dto) {
        exercise.setTitle(dto.getTitle());
        exercise.setDescription(dto.getDescription());
        exercise.setType(dto.getType());
        exercise.setDifficulty(dto.getDifficulty());
        exercise.setDifficultyLevel(dto.getDifficulty());
        exercise.setTimeLimitSeconds(dto.getTimeLimit() != null ? dto.getTimeLimit() * 60 : null);
        exercise.setPoints(dto.getPoints());
        exercise.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        // Note: Image and Audio URLs are handled separately in file upload methods
        if (dto.getImageUrl() != null) {
            exercise.setImageUrl(dto.getImageUrl());
        }
        if (dto.getAudioUrl() != null) {
            exercise.setAudioUrl(dto.getAudioUrl());
        }
    }

    private Long getUserId(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new RuntimeException("Authentication required");
        }

        Optional<User> userOpt = userRepository.findByUsername(auth.getName());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + auth.getName());
        }

        return userOpt.get().getId();
    }
}
