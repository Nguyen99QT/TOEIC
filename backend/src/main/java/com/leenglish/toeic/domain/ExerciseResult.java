package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ================================================================
 * EXERCISE RESULT ENTITY - Track exercise completion by user
 * ================================================================
 */
@Entity
@Table(name = "exercise_results", indexes = {
        @Index(name = "idx_user_exercise", columnList = "user_id, exercise_id"),
        @Index(name = "idx_lesson_user", columnList = "lesson_id, user_id"),
        @Index(name = "idx_exercise_completion", columnList = "exercise_id, is_completed")
}, uniqueConstraints = {
        @UniqueConstraint(name = "unique_user_exercise_attempt", columnNames = { "user_id", "exercise_id",
                "attempt_number" })
})
public class ExerciseResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "answers_correct", columnDefinition = "int default 0")
    private Integer answersCorrect = 0;

    @Column(name = "total_questions", columnDefinition = "int default 0")
    private Integer totalQuestions = 0;

    @Column(name = "time_taken")
    private Integer timeTaken; // in seconds

    @Column(precision = 5, scale = 2)
    private BigDecimal percentage;

    @Column(name = "is_completed", columnDefinition = "tinyint(1) default 1")
    private Boolean isCompleted = true;

    @Column(name = "attempt_number", columnDefinition = "int default 1")
    private Integer attemptNumber = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public ExerciseResult() {
    }

    public ExerciseResult(User user, Exercise exercise, Lesson lesson,
            BigDecimal score, Integer answersCorrect, Integer totalQuestions,
            Integer timeTaken, BigDecimal percentage) {
        this.user = user;
        this.exercise = exercise;
        this.lesson = lesson;
        this.score = score;
        this.answersCorrect = answersCorrect;
        this.totalQuestions = totalQuestions;
        this.timeTaken = timeTaken;
        this.percentage = percentage;
        this.isCompleted = true;
        this.attemptNumber = 1;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public Integer getAnswersCorrect() {
        return answersCorrect;
    }

    public void setAnswersCorrect(Integer answersCorrect) {
        this.answersCorrect = answersCorrect;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public Integer getAttemptNumber() {
        return attemptNumber;
    }

    public void setAttemptNumber(Integer attemptNumber) {
        this.attemptNumber = attemptNumber;
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
