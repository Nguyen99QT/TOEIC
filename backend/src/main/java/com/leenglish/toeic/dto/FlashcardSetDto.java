package com.leenglish.toeic.dto;

import java.time.LocalDateTime;
import java.util.List;

public class FlashcardSetDto {
    private Long id;
    private String name;
    private String description;
    private Boolean isPublic;
    private Boolean isActive;
    // Nếu có các trường sau thì thêm getter/setter:
    private String title;
    private Boolean isPremium;
    private Integer estimatedTimeMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long createdBy; // User ID
    private List<FlashcardDto> flashcards;

    public FlashcardSetDto() {
    }

    public FlashcardSetDto(Long id, String name, String description, Boolean isPublic, Boolean isActive,
            String title, Boolean isPremium, Integer estimatedTimeMinutes,
            LocalDateTime createdAt, LocalDateTime updatedAt, Long createdBy) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
        this.isActive = isActive;
        this.title = title;
        this.isPremium = isPremium;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    public Integer getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
        this.estimatedTimeMinutes = estimatedTimeMinutes;
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

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public List<FlashcardDto> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<FlashcardDto> flashcards) {
        this.flashcards = flashcards;
    }
}
