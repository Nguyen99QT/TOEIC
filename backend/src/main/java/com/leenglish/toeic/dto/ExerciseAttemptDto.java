package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class ExerciseAttemptDto {
    private Long id;
    private Long userId;
    private Long exerciseId;
    private String exerciseTitle;
    private Integer score;
    private Integer maxScore;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Integer timeSpentMinutes;
    private Boolean isCompleted;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    public ExerciseAttemptDto() {
    }

    public ExerciseAttemptDto(Long id, Long userId, Long exerciseId, String exerciseTitle,
            Integer score, Integer maxScore, Integer correctAnswers,
            Integer totalQuestions, Integer timeSpentMinutes,
            Boolean isCompleted, LocalDateTime startedAt,
            LocalDateTime completedAt) {
        this.id = id;
        this.userId = userId;
        this.exerciseId = exerciseId;
        this.exerciseTitle = exerciseTitle;
        this.score = score;
        this.maxScore = maxScore;
        this.correctAnswers = correctAnswers;
        this.totalQuestions = totalQuestions;
        this.timeSpentMinutes = timeSpentMinutes;
        this.isCompleted = isCompleted;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
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

    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public String getExerciseTitle() {
        return exerciseTitle;
    }

    public void setExerciseTitle(String exerciseTitle) {
        this.exerciseTitle = exerciseTitle;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getMaxScore() {
        return maxScore;
    }

    public void setMaxScore(Integer maxScore) {
        this.maxScore = maxScore;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
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
}
