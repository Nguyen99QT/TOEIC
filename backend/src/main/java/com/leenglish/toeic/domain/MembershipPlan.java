package com.leenglish.toeic.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.leenglish.toeic.enums.MembershipType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "membership_plans")
public class MembershipPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, name = "duration_in_days")
    private Integer durationInDays;

    @Column(name = "plan_type")
    private String planType; // MONTHLY, YEARLY, LIFETIME

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "is_popular")
    private Boolean isPopular = false;

    @Column(name = "max_exercises_per_day")
    private Integer maxExercisesPerDay;

    @Column(name = "max_lessons_access")
    private Integer maxLessonsAccess;

    @Column(name = "access_premium_content")
    private Boolean accessPremiumContent = false;

    @Column(name = "access_audio_features")
    private Boolean accessAudioFeatures = false;

    @Column(name = "unlimited_flashcards")
    private Boolean unlimitedFlashcards = false;

    @Column(name = "priority_support")
    private Boolean prioritySupport = false;

    @Column(name = "download_offline")
    private Boolean downloadOffline = false;

    @Column(name = "features", columnDefinition = "TEXT")
    private String features; // JSON string of features

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "membershipPlan", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserMembership> memberships = new ArrayList<>();

    // New fields
    private String currency;

    private Integer durationDays;

    private Integer maxLessonsPerDay;

    private Integer maxFlashcardsPerSet;

    private Boolean hasAudioAccess;

    private Boolean hasPremiumContent;

    private Boolean hasProgressTracking;

    @Column(name = "membership_type")
    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;

    // Constructors
    public MembershipPlan() {
    }

    public MembershipPlan(String name, String description, BigDecimal price, Integer durationInDays) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.durationInDays = durationInDays;
        this.isActive = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getDurationInDays() {
        return durationInDays;
    }

    public void setDurationInDays(Integer durationInDays) {
        this.durationInDays = durationInDays;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsPopular() {
        return isPopular;
    }

    public void setIsPopular(Boolean isPopular) {
        this.isPopular = isPopular;
    }

    public Integer getMaxExercisesPerDay() {
        return maxExercisesPerDay;
    }

    public void setMaxExercisesPerDay(Integer maxExercisesPerDay) {
        this.maxExercisesPerDay = maxExercisesPerDay;
    }

    public Integer getMaxLessonsAccess() {
        return maxLessonsAccess;
    }

    public void setMaxLessonsAccess(Integer maxLessonsAccess) {
        this.maxLessonsAccess = maxLessonsAccess;
    }

    public Boolean getAccessPremiumContent() {
        return accessPremiumContent;
    }

    public void setAccessPremiumContent(Boolean accessPremiumContent) {
        this.accessPremiumContent = accessPremiumContent;
    }

    public Boolean getAccessAudioFeatures() {
        return accessAudioFeatures;
    }

    public void setAccessAudioFeatures(Boolean accessAudioFeatures) {
        this.accessAudioFeatures = accessAudioFeatures;
    }

    public Boolean getUnlimitedFlashcards() {
        return unlimitedFlashcards;
    }

    public void setUnlimitedFlashcards(Boolean unlimitedFlashcards) {
        this.unlimitedFlashcards = unlimitedFlashcards;
    }

    public Boolean getPrioritySupport() {
        return prioritySupport;
    }

    public void setPrioritySupport(Boolean prioritySupport) {
        this.prioritySupport = prioritySupport;
    }

    public Boolean getDownloadOffline() {
        return downloadOffline;
    }

    public void setDownloadOffline(Boolean downloadOffline) {
        this.downloadOffline = downloadOffline;
    }

    public String getFeatures() {
        return features;
    }

    public void setFeatures(String features) {
        this.features = features;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<UserMembership> getMemberships() {
        return memberships;
    }

    public void setMemberships(List<UserMembership> memberships) {
        this.memberships = memberships;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getMaxLessonsPerDay() {
        return maxLessonsPerDay;
    }

    public void setMaxLessonsPerDay(Integer maxLessonsPerDay) {
        this.maxLessonsPerDay = maxLessonsPerDay;
    }

    public Integer getMaxFlashcardsPerSet() {
        return maxFlashcardsPerSet;
    }

    public void setMaxFlashcardsPerSet(Integer maxFlashcardsPerSet) {
        this.maxFlashcardsPerSet = maxFlashcardsPerSet;
    }

    public Boolean getHasAudioAccess() {
        return hasAudioAccess;
    }

    public void setHasAudioAccess(Boolean hasAudioAccess) {
        this.hasAudioAccess = hasAudioAccess;
    }

    public Boolean getHasPremiumContent() {
        return hasPremiumContent;
    }

    public void setHasPremiumContent(Boolean hasPremiumContent) {
        this.hasPremiumContent = hasPremiumContent;
    }

    public Boolean getHasProgressTracking() {
        return hasProgressTracking;
    }

    public void setHasProgressTracking(Boolean hasProgressTracking) {
        this.hasProgressTracking = hasProgressTracking;
    }

    // Business Logic Methods
    public boolean isFree() {
        return price != null && price.compareTo(BigDecimal.ZERO) == 0;
    }

    public boolean isMonthly() {
        return "MONTHLY".equals(planType);
    }

    public boolean isYearly() {
        return "YEARLY".equals(planType);
    }

    public boolean isLifetime() {
        return "LIFETIME".equals(planType);
    }

    public boolean allowsPremiumContent() {
        return accessPremiumContent != null && accessPremiumContent;
    }

    public boolean hasUnlimitedAccess() {
        return maxExercisesPerDay == null || maxExercisesPerDay <= 0;
    }

    public double getDailyPrice() {
        if (price == null || durationInDays == null || durationInDays == 0)
            return 0.0;
        return price.doubleValue() / durationInDays;
    }

    public BigDecimal getMonthlyEquivalentPrice() {
        if (price == null || durationInDays == null || durationInDays == 0)
            return BigDecimal.ZERO;
        double dailyPrice = getDailyPrice();
        return BigDecimal.valueOf(dailyPrice * 30);
    }

    public int getDurationInMonths() {
        return durationInDays != null ? durationInDays / 30 : 0;
    }

    public boolean isValidPlan() {
        return name != null && !name.trim().isEmpty() &&
                price != null && price.compareTo(BigDecimal.ZERO) >= 0 &&
                durationInDays != null && durationInDays > 0;
    }

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (isActive == null)
            isActive = true;
        if (isPopular == null)
            isPopular = false;
        if (accessPremiumContent == null)
            accessPremiumContent = false;
        if (accessAudioFeatures == null)
            accessAudioFeatures = false;
        if (unlimitedFlashcards == null)
            unlimitedFlashcards = false;
        if (prioritySupport == null)
            prioritySupport = false;
        if (downloadOffline == null)
            downloadOffline = false;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
