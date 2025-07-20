package com.leenglish.toeic.dto;

import java.time.LocalDate;

import com.leenglish.toeic.enums.Gender;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * ================================================================
 * UPDATE USER PROFILE REQUEST DTO
 * ================================================================
 * 
 * DTO for updating user profile information
 * All fields are optional - only provided fields will be updated
 */
public class UpdateUserProfileRequest {

    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String email;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    @Pattern(regexp = "^[+]?[0-9\\s\\-\\(\\)]{0,20}$", message = "Phone number format is invalid")
    private String phone;

    private LocalDate dateOfBirth;

    private Gender gender;

    @Size(max = 50, message = "Country name cannot exceed 50 characters")
    private String country;

    @Size(max = 500, message = "Profile picture URL cannot exceed 500 characters")
    private String profilePictureUrl;

    // ========== CONSTRUCTORS ==========

    public UpdateUserProfileRequest() {
    }

    public UpdateUserProfileRequest(String fullName, String email, String phone, 
                                  LocalDate dateOfBirth, Gender gender, String country, 
                                  String profilePictureUrl) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.country = country;
        this.profilePictureUrl = profilePictureUrl;
    }

    // ========== GETTERS AND SETTERS ==========

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    // ========== UTILITY METHODS ==========

    /**
     * Check if any field is provided for update
     */
    public boolean hasAnyField() {
        return fullName != null || email != null || phone != null || 
               dateOfBirth != null || gender != null || country != null || 
               profilePictureUrl != null;
    }

    /**
     * Check if email is provided
     */
    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }

    /**
     * Check if full name is provided
     */
    public boolean hasFullName() {
        return fullName != null && !fullName.trim().isEmpty();
    }

    @Override
    public String toString() {
        return "UpdateUserProfileRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", dateOfBirth=" + dateOfBirth +
                ", gender=" + gender +
                ", country='" + country + '\'' +
                ", profilePictureUrl='" + profilePictureUrl + '\'' +
                '}';
    }
} 