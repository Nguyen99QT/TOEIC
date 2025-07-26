package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.service.FlashcardService;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.domain.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/flashcard-sets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FlashcardController {

    private final FlashcardService flashcardService;
    private final UserRepository userRepository;

    /**
     * Helper method to get user ID from authentication
     */
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

    // ========== COLLABORATOR CRUD ENDPOINTS ==========

    /**
     * Get all flashcard sets for collaborator management
     */
    @GetMapping("/collaborator/all")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getAllForCollaborator(Authentication auth) {
        try {
            log.info("🔍 Fetching all flashcard sets for collaborator: {}", auth.getName());
            List<FlashcardSetDto> sets = flashcardService.getAllFlashcardSets(0, 100); // Get first 100

            return ResponseEntity.ok(ApiResponse.success(
                    "Flashcard sets retrieved successfully",
                    sets));
        } catch (Exception e) {
            log.error("❌ Error fetching flashcard sets for collaborator", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch flashcard sets: " + e.getMessage()));
        }
    }

    /**
     * Create new flashcard set
     */
    @PostMapping("/collaborator/create")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> createFlashcardSet(
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        try {
            log.info("📝 Creating new flashcard set: {} by {}", flashcardSetDto.getTitle(), auth.getName());

            Long userId = getUserId(auth);
            FlashcardSetDto createdSet = flashcardService.createFlashcardSet(flashcardSetDto, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.successWithData(createdSet, "Flashcard set created successfully"));
        } catch (Exception e) {
            log.error("❌ Error creating flashcard set", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Update flashcard set
     */
    @PutMapping("/collaborator/{setId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> updateFlashcardSet(
            @PathVariable Long setId,
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        try {
            log.info("✏️ Updating flashcard set {} by {}", setId, auth.getName());

            Long userId = getUserId(auth);
            FlashcardSetDto updatedSet = flashcardService.updateFlashcardSet(setId, flashcardSetDto, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(updatedSet, "Flashcard set updated successfully"));
        } catch (Exception e) {
            log.error("❌ Error updating flashcard set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Delete flashcard set
     */
    @DeleteMapping("/collaborator/{setId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcardSet(
            @PathVariable Long setId,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting flashcard set {} by {}", setId, auth.getName());

            Long userId = getUserId(auth);
            flashcardService.deleteFlashcardSet(setId, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(null, "Flashcard set deleted successfully"));
        } catch (Exception e) {
            log.error("❌ Error deleting flashcard set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Get flashcard set details for editing
     */
    @GetMapping("/collaborator/{setId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> getFlashcardSetForEdit(
            @PathVariable Long setId,
            Authentication auth) {
        try {
            log.info("🔍 Fetching flashcard set {} for editing by {}", setId, auth.getName());

            FlashcardSetDto set = flashcardService.getFlashcardSetById(setId);

            return ResponseEntity.ok(ApiResponse.successWithData(set, "Flashcard set retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching flashcard set {} for editing", setId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Flashcard set not found: " + e.getMessage()));
        }
    }

    // ========== FLASHCARD CRUD WITHIN SET ==========

    /**
     * Get all flashcards in a set
     */
    @GetMapping("/{setId}/flashcards")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardDto>>> getFlashcardsInSet(
            @PathVariable Long setId,
            Authentication auth) {
        try {
            log.info("🔍 Fetching flashcards in set {} by {}", setId, auth.getName());

            List<FlashcardDto> flashcards = flashcardService.getFlashcardsBySet(setId);

            return ResponseEntity.ok(ApiResponse.successWithData(flashcards, "Flashcards retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching flashcards in set {}", setId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Failed to fetch flashcards: " + e.getMessage()));
        }
    }

    /**
     * Add flashcard to set
     */
    @PostMapping("/{setId}/flashcards")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardDto>> addFlashcardToSet(
            @PathVariable Long setId,
            @Valid @RequestBody FlashcardDto flashcardDto,
            Authentication auth) {
        try {
            log.info("📝 Adding flashcard to set {} by {}", setId, auth.getName());

            Long userId = getUserId(auth);
            FlashcardDto createdFlashcard = flashcardService.createFlashcard(flashcardDto, setId, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.successWithData(createdFlashcard, "Flashcard added successfully"));
        } catch (Exception e) {
            log.error("❌ Error adding flashcard to set {}", setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to add flashcard: " + e.getMessage()));
        }
    }

    /**
     * Update flashcard
     */
    @PutMapping("/{setId}/flashcards/{flashcardId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardDto>> updateFlashcard(
            @PathVariable Long setId,
            @PathVariable Long flashcardId,
            @Valid @RequestBody FlashcardDto flashcardDto,
            Authentication auth) {
        try {
            log.info("✏️ Updating flashcard {} in set {} by {}", flashcardId, setId, auth.getName());

            Long userId = getUserId(auth);
            FlashcardDto updatedFlashcard = flashcardService.updateFlashcard(flashcardId, flashcardDto, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(updatedFlashcard, "Flashcard updated successfully"));
        } catch (Exception e) {
            log.error("❌ Error updating flashcard {} in set {}", flashcardId, setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update flashcard: " + e.getMessage()));
        }
    }

    /**
     * Delete flashcard
     */
    @DeleteMapping("/{setId}/flashcards/{flashcardId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcard(
            @PathVariable Long setId,
            @PathVariable Long flashcardId,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting flashcard {} from set {} by {}", flashcardId, setId, auth.getName());

            Long userId = getUserId(auth);
            flashcardService.deleteFlashcard(flashcardId, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(null, "Flashcard deleted successfully"));
        } catch (Exception e) {
            log.error("❌ Error deleting flashcard {} from set {}", flashcardId, setId, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete flashcard: " + e.getMessage()));
        }
    }

    // ========== PUBLIC ENDPOINTS ==========

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getPublicFlashcardSets() {
        try {
            log.info("🔍 Fetching public flashcard sets");
            List<FlashcardSetDto> publicSets = flashcardService.getPopularFlashcardSets(50); // Get top 50 popular
                                                                                             // public sets
            return ResponseEntity.ok(ApiResponse.successWithData(publicSets, "Public flashcard sets retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching public flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch public flashcard sets: " + e.getMessage()));
        }
    }

    @GetMapping("/public/featured")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getFeaturedFlashcardSets(
            @RequestParam(defaultValue = "4") int limit) {
        try {
            List<FlashcardSetDto> featuredSets = flashcardService.getPopularFlashcardSets(limit); // Use popular instead
            return ResponseEntity
                    .ok(ApiResponse.successWithData(featuredSets, "Featured flashcard sets retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching featured flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch featured flashcard sets: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> getFlashcardSetById(@PathVariable Long id) {
        try {
            FlashcardSetDto flashcardSet = flashcardService.getFlashcardSetById(id);
            return ResponseEntity.ok(ApiResponse.successWithData(flashcardSet, "Flashcard set retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching flashcard set with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Flashcard set not found: " + e.getMessage()));
        }
    }

    // ========== SIMPLE CRUD ENDPOINTS FOR FRONTEND COMPATIBILITY ==========

    @PostMapping
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> createFlashcardSetSimple(
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        return createFlashcardSet(flashcardSetDto, auth);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> updateFlashcardSetSimple(
            @PathVariable Long id,
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        return updateFlashcardSet(id, flashcardSetDto, auth);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcardSetSimple(
            @PathVariable Long id,
            Authentication auth) {
        return deleteFlashcardSet(id, auth);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getAllFlashcardSets() {
        try {
            log.info("🔍 Fetching all flashcard sets");
            List<FlashcardSetDto> sets = flashcardService.getAllFlashcardSets(0, 100); // First 100 sets
            return ResponseEntity.ok(ApiResponse.successWithData(sets, "Flashcard sets retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching all flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch flashcard sets: " + e.getMessage()));
        }
    }
}

/**
 * Alternative FlashcardController for different API paths
 * Handles /api/flashcards/* endpoints for frontend compatibility
 */
@Slf4j
@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
class FlashcardAltController {

    private final FlashcardService flashcardService;
    private final UserRepository userRepository;

    /**
     * Helper method to get user ID from authentication
     */
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

    /**
     * Get flashcard set by ID - Alternative endpoint for frontend compatibility
     */
    @GetMapping("/set/{id}")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> getFlashcardSetByIdAlt(@PathVariable Long id) {
        try {
            log.info("🔍 Fetching flashcard set {} (alternative endpoint)", id);
            FlashcardSetDto flashcardSet = flashcardService.getFlashcardSetById(id);
            return ResponseEntity.ok(ApiResponse.successWithData(flashcardSet, "Flashcard set retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching flashcard set with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Flashcard set not found: " + e.getMessage()));
        }
    }

    /**
     * Get all public flashcard sets
     */
    @GetMapping("/public")
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getPublicFlashcardSetsAlt() {
        try {
            log.info("🔍 Fetching public flashcard sets (alternative endpoint)");
            List<FlashcardSetDto> publicSets = flashcardService.getPopularFlashcardSets(50);
            return ResponseEntity.ok(ApiResponse.successWithData(publicSets, "Public flashcard sets retrieved successfully"));
        } catch (Exception e) {
            log.error("❌ Error fetching public flashcard sets", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to fetch public flashcard sets: " + e.getMessage()));
        }
    }

    /**
     * Create new flashcard set
     */
    @PostMapping("/set")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> createFlashcardSetAlt(
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        try {
            log.info("📝 Creating new flashcard set by {}", auth.getName());

            Long userId = getUserId(auth);
            FlashcardSetDto createdSet = flashcardService.createFlashcardSet(flashcardSetDto, userId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.successWithData(createdSet, "Flashcard set created successfully"));
        } catch (Exception e) {
            log.error("❌ Error creating flashcard set", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to create flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Update flashcard set
     */
    @PutMapping("/set/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardSetDto>> updateFlashcardSetAlt(
            @PathVariable Long id,
            @Valid @RequestBody FlashcardSetDto flashcardSetDto,
            Authentication auth) {
        try {
            log.info("✏️ Updating flashcard set {} by {}", id, auth.getName());

            Long userId = getUserId(auth);
            FlashcardSetDto updatedSet = flashcardService.updateFlashcardSet(id, flashcardSetDto, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(updatedSet, "Flashcard set updated successfully"));
        } catch (Exception e) {
            log.error("❌ Error updating flashcard set {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to update flashcard set: " + e.getMessage()));
        }
    }

    /**
     * Delete flashcard set
     */
    @DeleteMapping("/set/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFlashcardSetAlt(
            @PathVariable Long id,
            Authentication auth) {
        try {
            log.info("🗑️ Deleting flashcard set {} by {}", id, auth.getName());

            Long userId = getUserId(auth);
            flashcardService.deleteFlashcardSet(id, userId);

            return ResponseEntity.ok(ApiResponse.successWithData(null, "Flashcard set deleted successfully"));
        } catch (Exception e) {
            log.error("❌ Error deleting flashcard set {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Failed to delete flashcard set: " + e.getMessage()));
        }
    }
}
