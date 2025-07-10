package com.leenglish.toeic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ================================================================
 * QUESTION ANSWER REQUEST DTO
 * ================================================================
 * Request object for submitting answers to questions
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAnswerRequest {

    @NotNull(message = "Question ID is required")
    @Positive(message = "Question ID must be positive")
    private Long questionId;

    @NotBlank(message = "Selected answer is required")
    @Pattern(regexp = "^[A-D]$", message = "Selected answer must be A, B, C, or D")
    private String selectedAnswer;

    @Positive(message = "Time taken must be positive")
    private Integer timeTaken; // in seconds (optional)

    // Additional fields for comprehensive answer tracking
    private Boolean isConfident; // User confidence level (optional)

    private String userNote; // Optional user note for this answer (optional)
}
