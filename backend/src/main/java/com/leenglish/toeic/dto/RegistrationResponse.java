package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

/**
 * ================================================================
 * REGISTRATION RESPONSE DTO - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Response DTO for user registration with email verification status
 */

public class RegistrationResponse {
    private String message;
    private UserInfo user;
    private boolean emailSent;
    private LocalDateTime registeredAt;

    public RegistrationResponse() {
    }

    public RegistrationResponse(String message, UserInfo user, boolean emailSent) {
        this.message = message;
        this.user = user;
        this.emailSent = emailSent;
        this.registeredAt = LocalDateTime.now();
    }

    // ========== GETTERS AND SETTERS ==========

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserInfo getUser() {
        return user;
    }

    public void setUser(UserInfo user) {
        this.user = user;
    }

    public boolean isEmailSent() {
        return emailSent;
    }

    public void setEmailSent(boolean emailSent) {
        this.emailSent = emailSent;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    // ========== INNER CLASSES ==========

    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String fullName;
        private String role;
        private boolean emailVerified;

        public UserInfo() {
        }

        public UserInfo(Long id, String username, String email, String fullName, String role, boolean emailVerified) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.emailVerified = emailVerified;
        }

        // ========== GETTERS AND SETTERS ==========

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public boolean isEmailVerified() {
            return emailVerified;
        }

        public void setEmailVerified(boolean emailVerified) {
            this.emailVerified = emailVerified;
        }
    }
} 