package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class ProgressStatsDto {
    private Long totalLessons;
    private Long completedLessons;
    private Long inProgressLessons;
    private Long notStartedLessons;
    private Double overallProgress;
    private Double completionRate;
    private Integer currentStreak;
    private Double averageStudyTimeMinutes;
    private Long totalTimeSpent;
    private LocalDateTime lastActivity;

    public ProgressStatsDto() {
    }

    public ProgressStatsDto(Long totalLessons, Long completedLessons, Long inProgressLessons,
            Long notStartedLessons, Double overallProgress, Double completionRate,
            Integer currentStreak, Double averageStudyTimeMinutes, Long totalTimeSpent,
            LocalDateTime lastActivity) {
        this.totalLessons = totalLessons;
        this.completedLessons = completedLessons;
        this.inProgressLessons = inProgressLessons;
        this.notStartedLessons = notStartedLessons;
        this.overallProgress = overallProgress;
        this.completionRate = completionRate;
        this.currentStreak = currentStreak;
        this.averageStudyTimeMinutes = averageStudyTimeMinutes;
        this.totalTimeSpent = totalTimeSpent;
        this.lastActivity = lastActivity;
    }

    // Getters and Setters
    public Long getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Long totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Long getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(Long completedLessons) {
        this.completedLessons = completedLessons;
    }

    public Long getInProgressLessons() {
        return inProgressLessons;
    }

    public void setInProgressLessons(Long inProgressLessons) {
        this.inProgressLessons = inProgressLessons;
    }

    public Long getNotStartedLessons() {
        return notStartedLessons;
    }

    public void setNotStartedLessons(Long notStartedLessons) {
        this.notStartedLessons = notStartedLessons;
    }

    public Double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(Double overallProgress) {
        this.overallProgress = overallProgress;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Integer getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(Integer currentStreak) {
        this.currentStreak = currentStreak;
    }

    public Double getAverageStudyTimeMinutes() {
        return averageStudyTimeMinutes;
    }

    public void setAverageStudyTimeMinutes(Double averageStudyTimeMinutes) {
        this.averageStudyTimeMinutes = averageStudyTimeMinutes;
    }

    public Long getTotalTimeSpent() {
        return totalTimeSpent;
    }

    public void setTotalTimeSpent(Long totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }

    public LocalDateTime getLastActivity() {
        return lastActivity;
    }

    public void setLastActivity(LocalDateTime lastActivity) {
        this.lastActivity = lastActivity;
    }

    // Utility methods
    public boolean isActiveToday() {
        if (lastActivity == null)
            return false;
        return lastActivity.toLocalDate().equals(java.time.LocalDate.now());
    }

    public String getProgressLevel() {
        if (overallProgress == null)
            return "Beginner";
        if (overallProgress >= 80)
            return "Advanced";
        if (overallProgress >= 50)
            return "Intermediate";
        return "Beginner";
    }

    public String getStreakStatus() {
        if (currentStreak == null || currentStreak == 0)
            return "No streak";
        if (currentStreak >= 30)
            return "Fire streak! 🔥";
        if (currentStreak >= 7)
            return "Great streak! ⭐";
        return "Building streak 💪";
    }
}
