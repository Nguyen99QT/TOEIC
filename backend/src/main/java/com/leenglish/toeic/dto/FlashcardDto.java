package com.leenglish.toeic.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardDto {
    
    private Long id;
    private String frontText;
    private String backText;
    
    // Add fields for backward compatibility
    private String frontContent;
    private String backContent;
    private String example;
    private String audioUrl;
    private String imageUrl;
    private String level;
    
    private Long flashcardSetId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
