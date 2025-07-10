package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class FlashcardDto {
    private Long id;
    private String term;
    private String definition;
    private String example;
    private String audioUrl;
    private String imageUrl;
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED
    private String category; // BUSINESS, ACADEMIC, DAILY_LIFE, etc.
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long flashcardSetId;

    public FlashcardDto() {
    }

    public FlashcardDto(Long id, String term, String definition, String example,
            String audioUrl, String imageUrl, String level, String category,
            Boolean isActive, LocalDateTime createdAt, LocalDateTime updatedAt,
            Long flashcardSetId) {
        this.id = id;
        this.term = term;
        this.definition = definition;
        this.example = example;
        this.audioUrl = audioUrl;
        this.imageUrl = imageUrl;
        this.level = level;
        this.category = category;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.flashcardSetId = flashcardSetId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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

    public Long getFlashcardSetId() {
        return flashcardSetId;
    }

    public void setFlashcardSetId(Long flashcardSetId) {
        this.flashcardSetId = flashcardSetId;
    }
}
