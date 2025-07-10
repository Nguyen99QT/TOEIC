package com.leenglish.toeic.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ================================================================
 * FEEDBACK DTO
 * ================================================================
 * DTO for user feedback after completing exercises
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDto {

    @NotNull(message = "Lesson ID is required")
    private Long lessonId;

    private Long exerciseId; // Optional - can be null if feedback is for the lesson only

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    private String comment; // Optional comment
}
