package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.service.FileUploadService;
import com.leenglish.toeic.service.FlashcardService;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.domain.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Comprehensive CRUD Controller for Flashcard and FlashcardSet Management
 * Supports image and audio file uploads for multimedia flashcards
 * 
 * @author GitHub Copilot
 * @version 1.0
 */
@Slf4j
@RestController
@RequestMapping("/api/flashcards-crud")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FlashcardCrudController {

    private final FlashcardService flashcardService;
    private final FileUploadService fileUploadService;
    private final UserRepository userRepository;

    /**
     * Helper method to get user ID from authentication
     */
    private Long getUserId(Authentication auth) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(auth.getName());
            if (userOpt.isPresent()) {
                return userOpt.get().getId();
            }
            throw new RuntimeException("User not found: " + auth.getName());
        } catch (Exception e) {
            log.error("Error getting user ID for {}: {}", auth.getName(), e.getMessage());
            throw new RuntimeException("Authentication error");
        }
    }

    // ========== FLASHCARD SET CRUD OPERATIONS ==========

    /**
     * Get all flashcard sets with pagination and filtering
     */
    @GetMapping("/sets")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getAllFlashcardSets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            Authentication auth) {
        try {
            log.info("📚 Fetching flashcard sets - page: {}, size: {} by {}", page, size, auth.getName());

            List<FlashcardSetDto> flashcardSets;

            if (search != null && !search.trim().isEmpty()) {
                flashcardSets = flashcardService.searchFlashcardSets(search, page, size);
            } else {
                flashcardSets = flashcardService.getAllFlashcardSets(page, size);
            }

            // Apply additional filters if needed
            if (category != null && !category.trim().isEmpty()) {
                flashcardSets = flashcardSets.stream()
                        .filter(set -> category.equals(set.getCategory()))
                        .toList();
            }

            if (difficulty != null && !difficulty.trim().isEmpty()) {
                flashcardSets = flashcardSets.stream()
                        .filter(set -> difficulty.equals(set.getDifficultyLevel()))
                        .toList();
            }

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard sets retrieved successfully", flashcardSets));

        } catch (Exception e) {
            log.error("❌ Error fetching flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch flashcard sets: " + e.getMessage()));
        }
    }

    /**
     * Get flashcard set by ID
     */
    @GetMapping("/sets/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> getFlashcardSetById(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🔍 Fetching flashcard set {} by {}", id, auth.getName());

            FlashcardSetDto flashcardSet = flashcardService.getFlashcardSetById(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard set retrieved successfully", flashcardSet));

        } catch (Exception e) {
            log.error("❌ Error fetching flashcard set {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Flashcard set not found: " + e.getMessage()));
        }
    }

    /**
     * Create new flashcard set with optional image/audio upload
     */
    @PostMapping("/sets")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> createFlashcardSet(
            @Valid @RequestPart("flashcardSet") FlashcardSetDto flashcardSetDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio,
            Authentication auth) {
        try {
            log.info("📝 Creating flashcard set: {} by {}", flashcardSetDto.getTitle(), auth.getName());

            Long userId = getUserId(auth);

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = fileUploadService.uploadImage(image);
                    flashcardSetDto.setImageUrl(imageUrl);
                    log.info("📸 Image uploaded successfully: {}", imageUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload image", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
                }
            }

            // Handle audio upload if provided
            if (audio != null && !audio.isEmpty()) {
                try {
                    String audioUrl = fileUploadService.uploadAudio(audio);
                    flashcardSetDto.setAudioUrl(audioUrl);
                    log.info("🎵 Audio uploaded successfully: {}", audioUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload audio", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
                }
            }

            FlashcardSetDto createdSet = flashcardService.createFlashcardSet(flashcardSetDto, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Flashcard set created successfully", createdSet));

        } catch (Exception e) {
            log.error("❌ Error creating flashcard set", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Update flashcard set with optional image/audio upload
     */
    @PutMapping("/sets/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> updateFlashcardSet(
            @PathVariable Long id,
            @Valid @RequestPart("flashcardSet") FlashcardSetDto flashcardSetDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio,
            Authentication auth) {
        try {
            log.info("✏️ Updating flashcard set {} by {}", id, auth.getName());

            Long userId = getUserId(auth);

            // Get existing flashcard set to preserve current media URLs
            FlashcardSetDto existingSet = flashcardService.getFlashcardSetById(id);

            // Handle image upload/update
            if (image != null && !image.isEmpty()) {
                try {
                    // Delete old image if exists
                    if (existingSet.getImageUrl() != null && !existingSet.getImageUrl().isEmpty()) {
                        fileUploadService.deleteFile(existingSet.getImageUrl());
                    }

                    String imageUrl = fileUploadService.uploadImage(image);
                    flashcardSetDto.setImageUrl(imageUrl);
                    log.info("📸 Image updated successfully: {}", imageUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload image", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
                }
            } else {
                // Preserve existing image URL if no new image is uploaded
                flashcardSetDto.setImageUrl(existingSet.getImageUrl());
            }

            // Handle audio upload/update
            if (audio != null && !audio.isEmpty()) {
                try {
                    // Delete old audio if exists
                    if (existingSet.getAudioUrl() != null && !existingSet.getAudioUrl().isEmpty()) {
                        fileUploadService.deleteFile(existingSet.getAudioUrl());
                    }

                    String audioUrl = fileUploadService.uploadAudio(audio);
                    flashcardSetDto.setAudioUrl(audioUrl);
                    log.info("🎵 Audio updated successfully: {}", audioUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload audio", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
                }
            } else {
                // Preserve existing audio URL if no new audio is uploaded
                flashcardSetDto.setAudioUrl(existingSet.getAudioUrl());
            }

            FlashcardSetDto updatedSet = flashcardService.updateFlashcardSet(id, flashcardSetDto, userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard set updated successfully", updatedSet));

        } catch (Exception e) {
            log.error("❌ Error updating flashcard set {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Delete flashcard set and associated media files
     */
    @DeleteMapping("/sets/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcardSet(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting flashcard set {} by {}", id, auth.getName());

            Long userId = getUserId(auth);

            // Get flashcard set to delete associated media files
            FlashcardSetDto flashcardSet = flashcardService.getFlashcardSetById(id);

            // Delete associated media files
            if (flashcardSet.getImageUrl() != null && !flashcardSet.getImageUrl().isEmpty()) {
                try {
                    fileUploadService.deleteFile(flashcardSet.getImageUrl());
                    log.info("📸 Deleted image: {}", flashcardSet.getImageUrl());
                } catch (Exception e) {
                    log.warn("⚠️ Failed to delete image file: {}", e.getMessage());
                }
            }

            if (flashcardSet.getAudioUrl() != null && !flashcardSet.getAudioUrl().isEmpty()) {
                try {
                    fileUploadService.deleteFile(flashcardSet.getAudioUrl());
                    log.info("🎵 Deleted audio: {}", flashcardSet.getAudioUrl());
                } catch (Exception e) {
                    log.warn("⚠️ Failed to delete audio file: {}", e.getMessage());
                }
            }

            flashcardService.deleteFlashcardSet(id, userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard set deleted successfully", null));

        } catch (Exception e) {
            log.error("❌ Error deleting flashcard set {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete flashcard set: " + e.getMessage()));
        }
    }

    // ========== INDIVIDUAL FLASHCARD CRUD OPERATIONS ==========

    /**
     * Get all flashcards in a set
     */
    @GetMapping("/sets/{setId}/flashcards")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardDto>>> getFlashcardsBySet(
            @PathVariable Long setId,
            Authentication auth) {
        try {
            log.info("📄 Fetching flashcards in set {} by {}", setId, auth.getName());

            List<FlashcardDto> flashcards = flashcardService.getFlashcardsBySet(setId);

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcards retrieved successfully", flashcards));

        } catch (Exception e) {
            log.error("❌ Error fetching flashcards in set {}", setId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Failed to fetch flashcards: " + e.getMessage()));
        }
    }

    /**
     * Get flashcard by ID
     */
    @GetMapping("/flashcards/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardDto>> getFlashcardById(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🔍 Fetching flashcard {} by {}", id, auth.getName());

            FlashcardDto flashcard = flashcardService.getFlashcardById(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard retrieved successfully", flashcard));

        } catch (Exception e) {
            log.error("❌ Error fetching flashcard {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Flashcard not found: " + e.getMessage()));
        }
    }

    /**
     * Create new flashcard with optional image/audio upload
     */
    @PostMapping("/sets/{setId}/flashcards")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardDto>> createFlashcard(
            @PathVariable Long setId,
            @Valid @RequestPart("flashcard") FlashcardDto flashcardDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio,
            Authentication auth) {
        try {
            log.info("📝 Creating flashcard in set {} by {}", setId, auth.getName());

            Long userId = getUserId(auth);

            // Handle image upload if provided
            if (image != null && !image.isEmpty()) {
                try {
                    String imageUrl = fileUploadService.uploadImage(image);
                    flashcardDto.setImageUrl(imageUrl);
                    log.info("📸 Image uploaded successfully: {}", imageUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload image", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
                }
            }

            // Handle audio upload if provided
            if (audio != null && !audio.isEmpty()) {
                try {
                    String audioUrl = fileUploadService.uploadAudio(audio);
                    flashcardDto.setAudioUrl(audioUrl);
                    log.info("🎵 Audio uploaded successfully: {}", audioUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload audio", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
                }
            }

            FlashcardDto createdFlashcard = flashcardService.createFlashcard(flashcardDto, setId, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Flashcard created successfully", createdFlashcard));

        } catch (Exception e) {
            log.error("❌ Error creating flashcard in set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create flashcard: " + e.getMessage()));
        }
    }

    /**
     * Update flashcard with optional image/audio upload
     */
    @PutMapping("/flashcards/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardDto>> updateFlashcard(
            @PathVariable Long id,
            @Valid @RequestPart("flashcard") FlashcardDto flashcardDto,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "audio", required = false) MultipartFile audio,
            Authentication auth) {
        try {
            log.info("✏️ Updating flashcard {} by {}", id, auth.getName());

            Long userId = getUserId(auth);

            // Get existing flashcard to preserve current media URLs
            FlashcardDto existingFlashcard = flashcardService.getFlashcardById(id);

            // Handle image upload/update
            if (image != null && !image.isEmpty()) {
                try {
                    // Delete old image if exists
                    if (existingFlashcard.getImageUrl() != null && !existingFlashcard.getImageUrl().isEmpty()) {
                        fileUploadService.deleteFile(existingFlashcard.getImageUrl());
                    }

                    String imageUrl = fileUploadService.uploadImage(image);
                    flashcardDto.setImageUrl(imageUrl);
                    log.info("📸 Image updated successfully: {}", imageUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload image", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
                }
            } else {
                // Preserve existing image URL if no new image is uploaded
                flashcardDto.setImageUrl(existingFlashcard.getImageUrl());
            }

            // Handle audio upload/update
            if (audio != null && !audio.isEmpty()) {
                try {
                    // Delete old audio if exists
                    if (existingFlashcard.getAudioUrl() != null && !existingFlashcard.getAudioUrl().isEmpty()) {
                        fileUploadService.deleteFile(existingFlashcard.getAudioUrl());
                    }

                    String audioUrl = fileUploadService.uploadAudio(audio);
                    flashcardDto.setAudioUrl(audioUrl);
                    log.info("🎵 Audio updated successfully: {}", audioUrl);
                } catch (Exception e) {
                    log.error("❌ Failed to upload audio", e);
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
                }
            } else {
                // Preserve existing audio URL if no new audio is uploaded
                flashcardDto.setAudioUrl(existingFlashcard.getAudioUrl());
            }

            FlashcardDto updatedFlashcard = flashcardService.updateFlashcard(id, flashcardDto, userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard updated successfully", updatedFlashcard));

        } catch (Exception e) {
            log.error("❌ Error updating flashcard {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update flashcard: " + e.getMessage()));
        }
    }

    /**
     * Delete flashcard and associated media files
     */
    @DeleteMapping("/flashcards/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcard(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting flashcard {} by {}", id, auth.getName());

            Long userId = getUserId(auth);

            // Get flashcard to delete associated media files
            FlashcardDto flashcard = flashcardService.getFlashcardById(id);

            // Delete associated media files
            if (flashcard.getImageUrl() != null && !flashcard.getImageUrl().isEmpty()) {
                try {
                    fileUploadService.deleteFile(flashcard.getImageUrl());
                    log.info("📸 Deleted image: {}", flashcard.getImageUrl());
                } catch (Exception e) {
                    log.warn("⚠️ Failed to delete image file: {}", e.getMessage());
                }
            }

            if (flashcard.getAudioUrl() != null && !flashcard.getAudioUrl().isEmpty()) {
                try {
                    fileUploadService.deleteFile(flashcard.getAudioUrl());
                    log.info("🎵 Deleted audio: {}", flashcard.getAudioUrl());
                } catch (Exception e) {
                    log.warn("⚠️ Failed to delete audio file: {}", e.getMessage());
                }
            }

            flashcardService.deleteFlashcard(id, userId);

            return ResponseEntity.ok(
                    ApiResponse.success("Flashcard deleted successfully", null));

        } catch (Exception e) {
            log.error("❌ Error deleting flashcard {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete flashcard: " + e.getMessage()));
        }
    }

    // ========== FILE UPLOAD ENDPOINTS ==========

    /**
     * Upload image for flashcard set
     */
    @PostMapping("/sets/{setId}/upload-image")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFlashcardSetImage(
            @PathVariable Long setId,
            @RequestParam("image") MultipartFile image,
            Authentication auth) {
        try {
            log.info("📸 Uploading image for flashcard set {} by {}", setId, auth.getName());

            String imageUrl = fileUploadService.uploadImage(image);

            return ResponseEntity.ok(
                    ApiResponse.success("Image uploaded successfully",
                            Map.of("imageUrl", imageUrl)));

        } catch (Exception e) {
            log.error("❌ Error uploading image for flashcard set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Upload audio for flashcard set
     */
    @PostMapping("/sets/{setId}/upload-audio")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFlashcardSetAudio(
            @PathVariable Long setId,
            @RequestParam("audio") MultipartFile audio,
            Authentication auth) {
        try {
            log.info("🎵 Uploading audio for flashcard set {} by {}", setId, auth.getName());

            String audioUrl = fileUploadService.uploadAudio(audio);

            return ResponseEntity.ok(
                    ApiResponse.success("Audio uploaded successfully",
                            Map.of("audioUrl", audioUrl)));

        } catch (Exception e) {
            log.error("❌ Error uploading audio for flashcard set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
        }
    }

    /**
     * Upload image for individual flashcard
     */
    @PostMapping("/flashcards/{id}/upload-image")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFlashcardImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile image,
            Authentication auth) {
        try {
            log.info("📸 Uploading image for flashcard {} by {}", id, auth.getName());

            String imageUrl = fileUploadService.uploadImage(image);

            return ResponseEntity.ok(
                    ApiResponse.success("Image uploaded successfully",
                            Map.of("imageUrl", imageUrl)));

        } catch (Exception e) {
            log.error("❌ Error uploading image for flashcard {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload image: " + e.getMessage()));
        }
    }

    /**
     * Upload audio for individual flashcard
     */
    @PostMapping("/flashcards/{id}/upload-audio")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFlashcardAudio(
            @PathVariable Long id,
            @RequestParam("audio") MultipartFile audio,
            Authentication auth) {
        try {
            log.info("🎵 Uploading audio for flashcard {} by {}", id, auth.getName());

            String audioUrl = fileUploadService.uploadAudio(audio);

            return ResponseEntity.ok(
                    ApiResponse.success("Audio uploaded successfully",
                            Map.of("audioUrl", audioUrl)));

        } catch (Exception e) {
            log.error("❌ Error uploading audio for flashcard {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to upload audio: " + e.getMessage()));
        }
    }

    // ========== UTILITY ENDPOINTS ==========

    /**
     * Get popular flashcard sets
     */
    @GetMapping("/sets/popular")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getPopularFlashcardSets(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            log.info("🔥 Fetching popular flashcard sets (limit: {})", limit);

            List<FlashcardSetDto> popularSets = flashcardService.getPopularFlashcardSets(limit);

            return ResponseEntity.ok(
                    ApiResponse.success("Popular flashcard sets retrieved successfully", popularSets));

        } catch (Exception e) {
            log.error("❌ Error fetching popular flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch popular flashcard sets: " + e.getMessage()));
        }
    }

    /**
     * Get recent flashcard sets
     */
    @GetMapping("/sets/recent")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getRecentFlashcardSets(
            @RequestParam(defaultValue = "10") int limit) {
        try {
            log.info("🆕 Fetching recent flashcard sets (limit: {})", limit);

            List<FlashcardSetDto> recentSets = flashcardService.getRecentFlashcardSets(limit);

            return ResponseEntity.ok(
                    ApiResponse.success("Recent flashcard sets retrieved successfully", recentSets));

        } catch (Exception e) {
            log.error("❌ Error fetching recent flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch recent flashcard sets: " + e.getMessage()));
        }
    }

    /**
     * Search flashcard sets
     */
    @GetMapping("/sets/search")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> searchFlashcardSets(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        try {
            log.info("🔍 Searching flashcard sets: '{}' by {}", query, auth.getName());

            List<FlashcardSetDto> searchResults = flashcardService.searchFlashcardSets(query, page, size);

            return ResponseEntity.ok(
                    ApiResponse.success("Search completed successfully", searchResults));

        } catch (Exception e) {
            log.error("❌ Error searching flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Search failed: " + e.getMessage()));
        }
    }
}
