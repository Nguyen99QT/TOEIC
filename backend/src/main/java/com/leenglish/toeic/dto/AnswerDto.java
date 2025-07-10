package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AnswerDto {

    private Long id;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "isCorrect flag is required")
    private Boolean isCorrect;

    @NotBlank(message = "Option label is required")
    private String optionLabel;

    private Long questionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public AnswerDto() {
    }

    public AnswerDto(Long id, String content, Boolean isCorrect, String optionLabel,
            Long questionId, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.content = content;
        this.isCorrect = isCorrect;
        this.optionLabel = optionLabel;
        this.questionId = questionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public String getOptionLabel() {
        return optionLabel;
    }

    public void setOptionLabel(String optionLabel) {
        this.optionLabel = optionLabel;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
