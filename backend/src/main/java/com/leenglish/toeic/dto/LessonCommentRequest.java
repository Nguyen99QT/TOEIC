package com.leenglish.toeic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class LessonCommentRequest {
    
    @NotNull(message = "Lesson ID is required")
    private Long lessonId;
    
    @NotBlank(message = "Comment content is required")
    @Size(min = 1, max = 1000, message = "Comment content must be between 1 and 1000 characters")
    private String content;

    // Constructors
    public LessonCommentRequest() {
    }

    public LessonCommentRequest(Long lessonId, String content) {
        this.lessonId = lessonId;
        this.content = content;
    }

    // Getters and Setters
    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 