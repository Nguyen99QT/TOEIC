package com.leenglish.toeic.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.leenglish.toeic.dto.FlashcardDto;

public class FlashcardSetDto {
    private Long id;
    private String name;
    private String title;
    private String description;
    private Boolean isPublic;
    private Boolean isActive;
    private Boolean isPremium;
    private Integer estimatedTimeMinutes;
    private Integer cardCount; // ⚡ ADD THIS FIELD
    private Integer flashcardCount; // For compatibility
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<FlashcardDto> flashcards;

    // Constructors
    public FlashcardSetDto() {
    }

    public FlashcardSetDto(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    } // ⚡ ADD THIS

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

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    } // ⚡ ADD THIS

    public Integer getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
        this.estimatedTimeMinutes = estimatedTimeMinutes;
    } // ⚡ ADD THIS

    // ⚡ ADD THESE CARD COUNT METHODS
    public Integer getCardCount() {
        return cardCount;
    }

    public void setCardCount(Integer cardCount) {
        this.cardCount = cardCount;
    }

    public Integer getFlashcardCount() {
        return flashcardCount;
    }

    public void setFlashcardCount(Integer flashcardCount) {
        this.flashcardCount = flashcardCount;
        // Keep both fields in sync
        if (this.cardCount == null) {
            this.cardCount = flashcardCount;
        }
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
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

    public List<FlashcardDto> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<FlashcardDto> flashcards) {
        this.flashcards = flashcards;
    }

    @Override
    public String toString() {
        return "FlashcardSetDto{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", isPublic=" + isPublic +
                ", isActive=" + isActive +
                ", isPremium=" + isPremium +
                ", cardCount=" + cardCount +
                ", viewCount=" + viewCount +
                ", estimatedTimeMinutes=" + estimatedTimeMinutes +
                '}';
    }
}
