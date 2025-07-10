package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(name = "status", length = 50, nullable = false)
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage = 0;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "last_accessed_at")
    private LocalDateTime lastAccessedAt;

    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes = 0;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public UserLessonProgress() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public UserLessonProgress(User user, Lesson lesson) {
        this();
        this.user = user;
        this.lesson = lesson;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();

        // Auto-set timestamps based on status
        if ("IN_PROGRESS".equals(status) && startedAt == null) {
            this.startedAt = LocalDateTime.now();
        } else if ("COMPLETED".equals(status) && completedAt == null) {
            this.completedAt = LocalDateTime.now();
            this.progressPercentage = 100;
        }
    }

    public Integer getProgressPercentage() {
        return progressPercentage;
    }

    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
        this.updatedAt = LocalDateTime.now();

        // Auto-update status based on progress
        if (progressPercentage == 0) {
            this.status = "NOT_STARTED";
        } else if (progressPercentage >= 100) {
            this.status = "COMPLETED";
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        } else {
            this.status = "IN_PROGRESS";
            if (this.startedAt == null) {
                this.startedAt = LocalDateTime.now();
            }
        }
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
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
        this.updatedAt = LocalDateTime.now();
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
        this.updatedAt = LocalDateTime.now();
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

    // Business Logic Methods
    public boolean isNotStarted() {
        return "NOT_STARTED".equals(status);
    }

    public boolean isInProgress() {
        return "IN_PROGRESS".equals(status);
    }

    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }

    public void startLesson() {
        this.status = "IN_PROGRESS";
        this.startedAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void completeLesson() {
        this.status = "COMPLETED";
        this.progressPercentage = 100;
        this.completedAt = LocalDateTime.now();
        this.lastAccessedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void updateProgress(int newProgress) {
        setProgressPercentage(newProgress);
        this.lastAccessedAt = LocalDateTime.now();
    }

    public void addTimeSpent(int minutesToAdd) {
        this.timeSpentMinutes = (this.timeSpentMinutes != null ? this.timeSpentMinutes : 0) + minutesToAdd;
        this.lastAccessedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public boolean isRecentlyAccessed(int hoursThreshold) {
        if (lastAccessedAt == null)
            return false;
        return lastAccessedAt.isAfter(LocalDateTime.now().minusHours(hoursThreshold));
    }

    public long getDaysSinceStarted() {
        if (startedAt == null)
            return 0;
        return java.time.temporal.ChronoUnit.DAYS.between(startedAt.toLocalDate(), LocalDateTime.now().toLocalDate());
    }

    public long getDaysSinceCompleted() {
        if (completedAt == null)
            return -1;
        return java.time.temporal.ChronoUnit.DAYS.between(completedAt.toLocalDate(), LocalDateTime.now().toLocalDate());
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        lastAccessedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
