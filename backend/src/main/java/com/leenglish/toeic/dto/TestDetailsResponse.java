package com.leenglish.toeic.dto;

import java.sql.Timestamp;

/**
 * Simple DTO for Test information without lazy loading issues
 */
public class TestDetailsResponse {
    private Long testId;
    private String title;
    private String description;
    private Timestamp createdAt;
    private String createdByName;
    
    // Constructors
    public TestDetailsResponse() {}
    
    public TestDetailsResponse(Long testId, String title, String description, 
                             Timestamp createdAt, String createdByName) {
        this.testId = testId;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.createdByName = createdByName;
    }
    
    // Getters and Setters
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
}
