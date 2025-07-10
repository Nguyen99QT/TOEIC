package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class UserProgressDto {
    private Long id;
    private Long userId;
    private Long lessonId;
    private String lessonTitle;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
    private Integer progressPercentage;
    private Integer timeSpentMinutes;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime lastAccessedAt;

    public UserProgressDto() {
    }

    public UserProgressDto(Long id, Long userId, Long lessonId, String lessonTitle,
            String status, Integer progressPercentage, Integer timeSpentMinutes,
            LocalDateTime startedAt, LocalDateTime completedAt,
            LocalDateTime lastAccessedAt) {
        this.id = id;
        this.userId = userId;
        this.lessonId = lessonId;
        this.lessonTitle = lessonTitle;
        this.status = status;
        this.progressPercentage = progressPercentage;
        this.timeSpentMinutes = timeSpentMinutes;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.lastAccessedAt = lastAccessedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }

    public void setLessonTitle(String lessonTitle) {
        this.lessonTitle = lessonTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }

    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }
}
