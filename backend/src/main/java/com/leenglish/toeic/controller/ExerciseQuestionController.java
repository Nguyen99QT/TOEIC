package com.leenglish.toeic.controller;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.leenglish.toeic.dto.QuestionDto;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.security.UserDetailsImpl;
import com.leenglish.toeic.service.QuestionService;

@RestController
@RequestMapping("/api/collaborator/exercises")
@CrossOrigin(origins = "*")
public class ExerciseQuestionController {

    @Autowired
    private QuestionService questionService;

    /**
     * Get all questions for a specific exercise
     */
    @GetMapping("/{exerciseId}/questions")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> getExerciseQuestions(@PathVariable Long exerciseId) {
        try {
            List<QuestionDto> questions = questionService.getQuestionsByExerciseId(exerciseId);

            System.out.println("✅ Retrieved " + questions.size() + " questions for exercise ID: " + exerciseId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Questions retrieved successfully", questions));
        } catch (Exception e) {
            System.err.println("❌ Error retrieving questions for exercise: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving questions: " + e.getMessage(), null));
        }
    }

    /**
     * Get a specific question by ID
     */
    @GetMapping("/{exerciseId}/questions/{questionId}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionDto>> getExerciseQuestion(
            @PathVariable Long exerciseId,
            @PathVariable Long questionId) {
        try {
            java.util.Optional<com.leenglish.toeic.domain.Question> questionOpt = questionService
                    .getQuestionEntityById(questionId);
            if (questionOpt.isPresent()) {
                QuestionDto questionDto = questionService.getQuestionById(questionId);
                System.out.println("✅ Retrieved question: " + questionDto.getText());
                return ResponseEntity.ok(new ApiResponse<>(true, "Question retrieved successfully", questionDto));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Question not found", null));
            }
        } catch (Exception e) {
            System.err.println("❌ Error retrieving question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving question: " + e.getMessage(), null));
        }
    }

    /**
     * Create a new question for an exercise
     */
    @PostMapping("/{exerciseId}/questions")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionDto>> createExerciseQuestion(
            @PathVariable Long exerciseId,
            @RequestBody QuestionDto questionDto,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Set exercise ID
            questionDto.setExerciseId(exerciseId);
            questionDto.setCreatedBy(userDetails.getUsername());

            System.out.println(
                    "📝 Creating new question for exercise ID: " + exerciseId + " by " + userDetails.getUsername());
            System.out.println("📝 Question text: " + questionDto.getText());

            QuestionDto createdQuestion = questionService.createQuestion(questionDto);

            System.out.println("✅ Question created successfully with ID: " + createdQuestion.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Question created successfully", createdQuestion));

        } catch (Exception e) {
            System.err.println("❌ Error creating question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating question: " + e.getMessage(), null));
        }
    }

    /**
     * Update an existing question
     */
    @PutMapping("/{exerciseId}/questions/{questionId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<QuestionDto>> updateExerciseQuestion(
            @PathVariable Long exerciseId,
            @PathVariable Long questionId,
            @RequestBody QuestionDto questionDto,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("📝 Updating question ID: " + questionId + " in exercise: " + exerciseId + " by "
                    + userDetails.getUsername());

            // Check if question exists
            java.util.Optional<com.leenglish.toeic.domain.Question> questionOpt = questionService
                    .getQuestionEntityById(questionId);
            if (!questionOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Question not found", null));
            }

            // Set the updater information
            questionDto.setUpdatedBy(userDetails.getUsername());
            questionDto.setExerciseId(exerciseId);

            QuestionDto updatedQuestion = questionService.updateQuestion(questionId, questionDto);

            System.out.println("✅ Question updated successfully: " + updatedQuestion.getText());
            return ResponseEntity.ok(new ApiResponse<>(true, "Question updated successfully", updatedQuestion));

        } catch (Exception e) {
            System.err.println("❌ Error updating question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error updating question: " + e.getMessage(), null));
        }
    }

    /**
     * Delete a question
     */
    @DeleteMapping("/{exerciseId}/questions/{questionId}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteExerciseQuestion(
            @PathVariable Long exerciseId,
            @PathVariable Long questionId,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("🗑️ Deleting question ID: " + questionId + " from exercise: " + exerciseId + " by "
                    + userDetails.getUsername());

            // Check if question exists
            java.util.Optional<com.leenglish.toeic.domain.Question> questionOpt = questionService
                    .getQuestionEntityById(questionId);
            if (!questionOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Question not found", null));
            }

            questionService.deleteQuestion(questionId);

            System.out.println("✅ Question deleted successfully: " + questionId);
            return ResponseEntity
                    .ok(new ApiResponse<>(true, "Question deleted successfully", "Question ID: " + questionId));

        } catch (Exception e) {
            System.err.println("❌ Error deleting question: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error deleting question: " + e.getMessage(), null));
        }
    }

    /**
     * Bulk create questions for an exercise
     */
    @PostMapping("/{exerciseId}/questions/bulk")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<QuestionDto>>> createBulkExerciseQuestions(
            @PathVariable Long exerciseId,
            @RequestBody List<QuestionDto> questionDtos,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            System.out.println("📝 Creating " + questionDtos.size() + " questions for exercise ID: " + exerciseId
                    + " by " + userDetails.getUsername());

            // Set exercise ID and creator for all questions
            questionDtos.forEach(questionDto -> {
                questionDto.setExerciseId(exerciseId);
                questionDto.setCreatedBy(userDetails.getUsername());
            });

            List<QuestionDto> createdQuestions = questionService.createBulkQuestions(questionDtos);

            System.out.println("✅ " + createdQuestions.size() + " questions created successfully");
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, createdQuestions.size() + " questions created successfully",
                            createdQuestions));

        } catch (Exception e) {
            System.err.println("❌ Error creating bulk questions: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error creating bulk questions: " + e.getMessage(), null));
        }
    }

    /**
     * Get question statistics for an exercise
     */
    @GetMapping("/{exerciseId}/questions/stats")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExerciseQuestionStats(
            @PathVariable Long exerciseId,
            Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            List<QuestionDto> allQuestions = questionService.getQuestionsByExerciseId(exerciseId);

            long totalQuestions = allQuestions.size();
            long easyQuestions = allQuestions.stream()
                    .filter(q -> "EASY".equalsIgnoreCase(q.getDifficulty()))
                    .count();
            long mediumQuestions = allQuestions.stream()
                    .filter(q -> "MEDIUM".equalsIgnoreCase(q.getDifficulty()))
                    .count();
            long hardQuestions = allQuestions.stream()
                    .filter(q -> "HARD".equalsIgnoreCase(q.getDifficulty()))
                    .count();

            // Count by type
            long readingQuestions = allQuestions.stream()
                    .filter(q -> "READING".equalsIgnoreCase(q.getType()))
                    .count();
            long listeningQuestions = allQuestions.stream()
                    .filter(q -> "LISTENING".equalsIgnoreCase(q.getType()))
                    .count();
            long vocabularyQuestions = allQuestions.stream()
                    .filter(q -> "VOCABULARY".equalsIgnoreCase(q.getType()))
                    .count();
            long grammarQuestions = allQuestions.stream()
                    .filter(q -> "GRAMMAR".equalsIgnoreCase(q.getType()))
                    .count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("exerciseId", exerciseId);
            stats.put("totalQuestions", totalQuestions);
            stats.put("difficultyBreakdown", Map.of(
                    "easy", easyQuestions,
                    "medium", mediumQuestions,
                    "hard", hardQuestions));
            stats.put("typeBreakdown", Map.of(
                    "reading", readingQuestions,
                    "listening", listeningQuestions,
                    "vocabulary", vocabularyQuestions,
                    "grammar", grammarQuestions));
            stats.put("collaborator", userDetails.getUsername());

            System.out.println("✅ Question stats retrieved for exercise: " + exerciseId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Question stats retrieved successfully", stats));

        } catch (Exception e) {
            System.err.println("❌ Error retrieving question stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving question stats: " + e.getMessage(), null));
        }
    }

    /**
     * Health check endpoint for exercise question API
     */
    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> healthCheck() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Exercise Question API is healthy", "OK"));
    }
}
