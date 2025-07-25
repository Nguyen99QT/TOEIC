package com.leenglish.toeic.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardSetDto {

    private Long id;
    private String title;
    private String description;
    private String difficultyLevel;
    private String category;
    private Boolean isPublic;
    private Boolean isFeatured;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer flashcardCount;

    // Add fields for FlashcardSetServiceImpl compatibility
    private Integer cardCount;
    private Boolean isPremium;
    private Integer estimatedTimeMinutes;
    private Integer viewCount;

    // Multimedia support
    private String imageUrl;
    private String audioUrl;
}
