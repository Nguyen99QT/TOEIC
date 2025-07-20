package com.leenglish.toeic.domain;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.leenglish.toeic.enums.Gender;
import com.leenglish.toeic.enums.MembershipType;
import com.leenglish.toeic.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * ================================================================
 * USER ENTITY - LEENGLISH TOEIC PLATFORM
 * ================================================================
 */

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_email", columnList = "email"),
        @Index(name = "idx_role", columnList = "role")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    @Column(name = "full_name", length = 100)
    private String fullName;

    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    @Column(length = 20)
    private String phone;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Size(max = 50, message = "Country name cannot exceed 50 characters")
    @Column(length = 50)
    private String country;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore = 0;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(name = "premium_expires_at")
    private LocalDateTime premiumExpiresAt;

    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_email_verified", nullable = false)
    private Boolean isEmailVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "membership_type", length = 20)
    private MembershipType membershipType;

    // ========== CONSTRUCTORS ==========

    public User() {
    }

    public User(String username, String email, String passwordHash, String fullName) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = Role.USER;
        this.isActive = true;
        this.totalScore = 0;
        this.isPremium = false;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Additional constructor needed by services
    public User(String username, String email, String passwordHash, String fullName, Role role) {
        this(username, email, passwordHash, fullName);
        this.role = role != null ? role : Role.USER;
    }

    // ========== LIFECYCLE CALLBACKS ==========

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;

        if (this.role == null) {
            this.role = Role.USER;
        }
        if (this.isActive == null) {
            this.isActive = true;
        }
        if (this.totalScore == null) {
            this.totalScore = 0;
        }
        if (this.isPremium == null) {
            this.isPremium = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    // Alias for Spring Security compatibility and service compatibility
    public String getPassword() {
        return passwordHash;
    }

    public void setPassword(String password) {
        this.passwordHash = password;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getTotalScore() {
        return totalScore != null ? totalScore : 0;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore != null ? totalScore : 0;
    }

    // Overloaded for int parameter (used by services)
    public void setTotalScore(int totalScore) {
        this.totalScore = totalScore;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    // Overloaded for boolean parameter (used by services)
    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    // Overloaded for boolean parameter (used by services)
    public void setIsPremium(boolean isPremium) {
        this.isPremium = isPremium;
    }

    public LocalDateTime getPremiumExpiresAt() {
        return premiumExpiresAt;
    }

    public void setPremiumExpiresAt(LocalDateTime premiumExpiresAt) {
        this.premiumExpiresAt = premiumExpiresAt;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    // Alias for avatar URL compatibility
    public String getAvatarUrl() {
        return profilePictureUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.profilePictureUrl = avatarUrl;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    // Additional setters needed by services
    public void setLastLoginDate(LocalDateTime lastLoginDate) {
        this.lastLogin = lastLoginDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Additional setter needed by services
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdAt = createdDate;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public MembershipType getMembershipType() {
        return membershipType;
    }

    public void setMembershipType(MembershipType membershipType) {
        this.membershipType = membershipType;
    }

    public Boolean getIsEmailVerified() {
        return isEmailVerified;
    }

    public void setIsEmailVerified(Boolean isEmailVerified) {
        this.isEmailVerified = isEmailVerified;
    }

    // ========== BUSINESS LOGIC METHODS ==========

    public boolean isAdmin() {
        return this.role == Role.ADMIN;
    }

    public boolean isCollaborator() {
        return this.role == Role.COLLABORATOR;
    }

    public boolean isPremium() {
        if (this.isPremium == null || !this.isPremium) {
            return false;
        }

        if (premiumExpiresAt != null && premiumExpiresAt.isBefore(LocalDateTime.now())) {
            this.isPremium = false;
            return false;
        }

        return true;
    }

    public boolean isActiveUser() {
        return isActive != null && isActive;
    }

    // Additional method needed by services
    public boolean isActive() {
        return isActiveUser();
    }

    public boolean canCreateContent() {
        return this.role == Role.ADMIN || this.role == Role.COLLABORATOR;
    }

    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.isActive = false;
        this.updatedAt = LocalDateTime.now();
    }

    public void activate() {
        this.isActive = true;
        this.updatedAt = LocalDateTime.now();
    }

    public void addScore(int points) {
        this.totalScore = (this.totalScore != null ? this.totalScore : 0) + points;
        this.updatedAt = LocalDateTime.now();
    }

    public String getDisplayName() {
        return (fullName != null && !fullName.trim().isEmpty()) ? fullName : username;
    }

    // ========== EQUALS AND HASHCODE ==========

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof User))
            return false;
        User user = (User) o;
        return id != null && id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                ", totalScore=" + totalScore +
                ", isPremium=" + isPremium +
                '}';
    }
}
