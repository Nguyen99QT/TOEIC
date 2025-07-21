package com.leenglish.toeic.dto;

/**
 * Request DTO for creating a random TOEIC test from question bank
 */
public record RandomTestRequest(
    String title,
    String description,
    Boolean useFullTOEICStructure  // true = full test (200 questions), false = quick test
) {
    public RandomTestRequest {
        // Default values
        if (title == null || title.trim().isEmpty()) {
            title = "Random TOEIC Test - " + java.time.LocalDateTime.now().toString();
        }
        if (description == null || description.trim().isEmpty()) {
            description = "Randomly generated test from question bank";
        }
        if (useFullTOEICStructure == null) {
            useFullTOEICStructure = false;
        }
    }
}
