package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_exercise_attempts")
public class UserExerciseAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id")
    private Exercise exercise;

    @Column(name = "attempt_number")
    private Integer attemptNumber = 1;

    @Column
    private Double score = 0.0; // percentage score

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;

    @Column(name = "time_taken")
    private Integer timeTaken; // seconds

    @Column(name = "status", nullable = false, length = 30)
    private String status = "IN_PROGRESS"; // IN_PROGRESS, COMPLETED, ABANDONED

    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    // Constructors
    public UserExerciseAttempt() {
    }

    public UserExerciseAttempt(User user, Exercise exercise, Integer totalQuestions) {
        this.user = user;
        this.exercise = exercise;
        this.totalQuestions = totalQuestions;
        this.startedAt = LocalDateTime.now();
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

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    // Business Logic Methods
    public boolean isCompleted() {
        return "COMPLETED".equals(status);
    }

    public boolean isInProgress() {
        return "IN_PROGRESS".equals(status);
    }

    public void completeAttempt() {
        this.status = "COMPLETED";
        this.completedAt = LocalDateTime.now();
        calculateScore();
    }

    public void abandonAttempt() {
        this.status = "ABANDONED";
        this.completedAt = LocalDateTime.now();
    }

    private void calculateScore() {
        if (totalQuestions != null && totalQuestions > 0 && correctAnswers != null) {
            this.score = (double) correctAnswers / totalQuestions * 100;
        }
    }

    public double getScorePercentage() {
        return score != null ? score : 0.0;
    }

    public boolean isPassed(double passingScore) {
        return getScorePercentage() >= passingScore;
    }

    public long getDurationInMinutes() {
        if (timeTaken != null) {
            return timeTaken / 60;
        }
        return 0;
    }
}
