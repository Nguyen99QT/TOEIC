package com.leenglish.toeic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.leenglish.toeic.domain.Feedback.FeedbackType;
import com.leenglish.toeic.domain.Feedback.Priority;

public class FeedbackRequest {
    
    @NotBlank(message = "Subject is required")
    @Size(min = 1, max = 200, message = "Subject must be between 1 and 200 characters")
    private String subject;
    
    @NotBlank(message = "Content is required")
    @Size(min = 1, max = 2000, message = "Content must be between 1 and 2000 characters")
    private String content;
    
    @NotNull(message = "Feedback type is required")
    private FeedbackType feedbackType = FeedbackType.GENERAL;
    
    private Priority priority = Priority.MEDIUM;
    
    private Boolean isAnonymous = false;
    
    @Email(message = "Contact email must be a valid email address")
    @Size(max = 255, message = "Contact email must not exceed 255 characters")
    private String contactEmail;
    
    @Size(max = 20, message = "Contact phone must not exceed 20 characters")
    private String contactPhone;

    // Constructors
    public FeedbackRequest() {
    }

    public FeedbackRequest(String subject, String content, FeedbackType feedbackType) {
        this.subject = subject;
        this.content = content;
        this.feedbackType = feedbackType;
    }

    // Getters and Setters
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public FeedbackType getFeedbackType() {
        return feedbackType;
    }

    public void setFeedbackType(FeedbackType feedbackType) {
        this.feedbackType = feedbackType;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Boolean getIsAnonymous() {
        return isAnonymous;
    }

    public void setIsAnonymous(Boolean isAnonymous) {
        this.isAnonymous = isAnonymous;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }
} 