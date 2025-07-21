package com.leenglish.toeic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * ================================================================
 * CHANGE PASSWORD REQUEST DTO
 * ================================================================
 * 
 * DTO for changing user password
 * Requires current password for security verification
 */
public class ChangePasswordRequest {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;

    // ========== CONSTRUCTORS ==========

    public ChangePasswordRequest() {
    }

    public ChangePasswordRequest(String currentPassword, String newPassword, String confirmPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    // ========== GETTERS AND SETTERS ==========

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    // ========== VALIDATION METHODS ==========

    /**
     * Check if new password matches confirm password
     */
    public boolean isPasswordMatch() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }

    /**
     * Check if new password is different from current password
     */
    public boolean isNewPasswordDifferent() {
        return newPassword != null && !newPassword.equals(currentPassword);
    }

    /**
     * Validate password strength
     */
    public boolean isPasswordStrong() {
        if (newPassword == null || newPassword.length() < 6) {
            return false;
        }
        
        // Check for at least one uppercase letter
        boolean hasUpperCase = newPassword.matches(".*[A-Z].*");
        // Check for at least one lowercase letter
        boolean hasLowerCase = newPassword.matches(".*[a-z].*");
        // Check for at least one digit
        boolean hasDigit = newPassword.matches(".*\\d.*");
        // Check for at least one special character
        boolean hasSpecial = newPassword.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");
        
        return hasUpperCase && hasLowerCase && hasDigit && hasSpecial;
    }

    /**
     * Get password strength message
     */
    public String getPasswordStrengthMessage() {
        if (newPassword == null) {
            return "Password is required";
        }
        
        if (newPassword.length() < 6) {
            return "Password must be at least 6 characters long";
        }
        
        StringBuilder message = new StringBuilder();
        
        if (!newPassword.matches(".*[A-Z].*")) {
            message.append("Password must contain at least one uppercase letter. ");
        }
        if (!newPassword.matches(".*[a-z].*")) {
            message.append("Password must contain at least one lowercase letter. ");
        }
        if (!newPassword.matches(".*\\d.*")) {
            message.append("Password must contain at least one digit. ");
        }
        if (!newPassword.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            message.append("Password must contain at least one special character. ");
        }
        
        return message.toString().trim();
    }

    @Override
    public String toString() {
        return "ChangePasswordRequest{" +
                "currentPassword='[HIDDEN]'" +
                ", newPassword='[HIDDEN]'" +
                ", confirmPassword='[HIDDEN]'" +
                '}';
    }
} 