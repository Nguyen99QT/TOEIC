package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.FlashcardStudySessionDto;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.service.FlashcardStudySessionService;
import com.leenglish.toeic.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ================================================================
 * FLASHCARD STUDY CONTROLLER
 * ================================================================
 * Handles flashcard study sessions, progress tracking, and analytics
 */

@RestController
@RequestMapping("/api/flashcards/study")
public class FlashcardStudyController {

    @Autowired
    private FlashcardStudySessionService flashcardStudySessionService;

    @Autowired
    private UserService userService;

    /**
     * Start or resume a study session
     */
    @PostMapping("/start")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardStudySessionDto>> startStudySession(
            @RequestParam Long flashcardSetId,
            @RequestParam(defaultValue = "FLASHCARD") String studyMode,
            Authentication authentication) {

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            FlashcardStudySessionDto session = flashcardStudySessionService.startStudySession(
                    user.getId(), flashcardSetId, studyMode);

            return ResponseEntity.ok(new ApiResponse<>(true, "Study session started successfully", session));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to start study session: " + e.getMessage(), null));
        }
    }

    /**
     * Submit answer for a flashcard
     */
    @PostMapping("/{sessionId}/answer")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardStudySessionDto>> submitAnswer(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> answerData) {

        try {
            Long cardId = Long.valueOf(answerData.get("cardId").toString());
            Boolean isCorrect = (Boolean) answerData.get("isCorrect");
            Integer timeSpent = answerData.get("timeSpent") != null
                    ? Integer.valueOf(answerData.get("timeSpent").toString())
                    : 0;

            FlashcardStudySessionDto session = flashcardStudySessionService.submitAnswer(
                    sessionId, cardId, isCorrect, timeSpent);

            return ResponseEntity.ok(new ApiResponse<>(true, "Answer submitted successfully", session));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to submit answer: " + e.getMessage(), null));
        }
    }

    /**
     * Complete study session
     */
    @PostMapping("/{sessionId}/complete")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardStudySessionDto>> completeSession(@PathVariable Long sessionId) {
        try {
            FlashcardStudySessionDto session = flashcardStudySessionService.completeSession(sessionId);

            return ResponseEntity.ok(new ApiResponse<>(true, "Study session completed successfully", session));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to complete session: " + e.getMessage(), null));
        }
    }

    /**
     * Get user progress for a flashcard set
     */
    @GetMapping("/progress/{flashcardSetId}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserProgress(
            @PathVariable Long flashcardSetId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> progress = flashcardStudySessionService.getUserProgress(
                    user.getId(), flashcardSetId);

            return ResponseEntity.ok(new ApiResponse<>(true, "Progress retrieved successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get progress: " + e.getMessage(), null));
        }
    }

    /**
     * Get user overall study statistics - ONLY ONE VERSION
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStudyStats(Authentication auth) {
        try {
            if (auth == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "Authentication required", null));
            }

            String email = auth.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> stats = flashcardStudySessionService.getUserStudyStats(user.getId());
            
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Study statistics retrieved successfully",
                    stats));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to get study statistics: " + e.getMessage(), null));
        }
    }

    /**
     * Get active session for a flashcard set
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FlashcardStudySessionDto>> getActiveSession(
            @RequestParam Long flashcardSetId,
            Authentication authentication) {

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Optional<FlashcardStudySessionDto> session = flashcardStudySessionService.getActiveSession(
                    user.getId(), flashcardSetId);

            if (session.isPresent()) {
                return ResponseEntity.ok(new ApiResponse<>(true, "Active session found", session.get()));
            } else {
                return ResponseEntity.ok(new ApiResponse<>(true, "No active session found", null));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get active session: " + e.getMessage(), null));
        }
    }

    /**
     * Get user's study history
     */
    @GetMapping("/history")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<FlashcardStudySessionDto>>> getStudyHistory(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<FlashcardStudySessionDto> history = flashcardStudySessionService.getUserStudyHistory(
                    user.getId(), limit);

            return ResponseEntity.ok(new ApiResponse<>(true, "Study history retrieved successfully", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get study history: " + e.getMessage(), null));
        }
    }

    /**
     * Get progress for multiple flashcard sets - RENAMED FROM getSetProgress
     */
    @GetMapping("/progress")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMultipleSetProgress(
            @RequestParam(required = false) Long flashcardSetId,
            Authentication authentication) {

        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> progress;
            if (flashcardSetId != null) {
                progress = flashcardStudySessionService.getUserProgress(user.getId(), flashcardSetId);
            } else {
                progress = flashcardStudySessionService.getUserStudyStats(user.getId());
            }

            return ResponseEntity.ok(new ApiResponse<>(true, "Progress retrieved successfully", progress));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, "Failed to get progress: " + e.getMessage(), null));
        }
    }
}
