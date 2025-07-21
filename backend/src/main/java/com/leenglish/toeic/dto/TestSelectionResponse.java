package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

/**
 * Response DTO for test selection - includes both existing and newly created tests
 */
public class TestSelectionResponse {
    private Long testId;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private Integer totalQuestions;
    private String testType; // "EXISTING" or "RANDOM_GENERATED"
    private Boolean isNewlyCreated;
    
    // Constructors
    public TestSelectionResponse() {}
    
    public TestSelectionResponse(Long testId, String title, String description, 
                               LocalDateTime createdAt, Integer totalQuestions, 
                               String testType, Boolean isNewlyCreated) {
        this.testId = testId;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.totalQuestions = totalQuestions;
        this.testType = testType;
        this.isNewlyCreated = isNewlyCreated;
    }
    
    // Getters and Setters
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }
    
    public Boolean getIsNewlyCreated() { return isNewlyCreated; }
    public void setIsNewlyCreated(Boolean isNewlyCreated) { this.isNewlyCreated = isNewlyCreated; }
}
