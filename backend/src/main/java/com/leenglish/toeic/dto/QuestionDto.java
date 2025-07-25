package com.leenglish.toeic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.leenglish.toeic.enums.DifficultyLevel;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionDto {

    private Long id;

    @NotNull(message = "Exercise ID is required")
    private Long exerciseId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    private String questionType;

    // Answer Options
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;

    @NotBlank(message = "Correct answer is required")
    private String correctAnswer;

    private String explanation;

    // FIX: Add difficulty level field
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.EASY;

    private Integer points;
    private Integer questionOrder;
    private Boolean isActive;

    // Additional fields
    private String audioUrl;
    private String imageUrl;
    private String createdBy;
    private String updatedBy;
    private String type; // Question type (READING, LISTENING, etc.)

    // Helper method
    public String getDifficultyDisplayName() {
        return difficultyLevel != null ? difficultyLevel.getDisplayName() : "Easy";
    }

    // Helper methods for compatibility
    public String getText() {
        return questionText;
    }

    public void setText(String text) {
        this.questionText = text;
    }

    public String getDifficulty() {
        return difficultyLevel != null ? difficultyLevel.name() : "EASY";
    }

    public void setDifficulty(String difficulty) {
        try {
            this.difficultyLevel = DifficultyLevel.valueOf(difficulty.toUpperCase());
        } catch (Exception e) {
            this.difficultyLevel = DifficultyLevel.EASY;
        }
    }
}
