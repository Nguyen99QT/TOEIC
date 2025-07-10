package com.leenglish.toeic.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class MembershipPlanDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private Integer durationDays;
    private Integer maxExercisesPerDay;
    private Integer maxLessonsPerDay;
    private Integer maxFlashcardsPerSet;
    private Boolean hasAudioAccess;
    private Boolean hasPremiumContent;
    private Boolean hasProgressTracking;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public MembershipPlanDto() {
    }

    public MembershipPlanDto(Long id, String name, String description, BigDecimal price,
            String currency, Integer durationDays, Integer maxExercisesPerDay,
            Integer maxLessonsPerDay, Integer maxFlashcardsPerSet,
            Boolean hasAudioAccess, Boolean hasPremiumContent,
            Boolean hasProgressTracking, Boolean isActive,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.currency = currency;
        this.durationDays = durationDays;
        this.maxExercisesPerDay = maxExercisesPerDay;
        this.maxLessonsPerDay = maxLessonsPerDay;
        this.maxFlashcardsPerSet = maxFlashcardsPerSet;
        this.hasAudioAccess = hasAudioAccess;
        this.hasPremiumContent = hasPremiumContent;
        this.hasProgressTracking = hasProgressTracking;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public Integer getMaxExercisesPerDay() {
        return maxExercisesPerDay;
    }

    public void setMaxExercisesPerDay(Integer maxExercisesPerDay) {
        this.maxExercisesPerDay = maxExercisesPerDay;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
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
}
