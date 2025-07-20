package com.leenglish.toeic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.leenglish.toeic.domain.Feedback.Status;

public class AdminResponseRequest {
    
    @NotBlank(message = "Admin response is required")
    @Size(min = 1, max = 2000, message = "Admin response must be between 1 and 2000 characters")
    private String adminResponse;
    
    @NotNull(message = "Status is required")
    private Status status;

    // Constructors
    public AdminResponseRequest() {
    }

    public AdminResponseRequest(String adminResponse, Status status) {
        this.adminResponse = adminResponse;
        this.status = status;
    }

    // Getters and Setters
    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
} 