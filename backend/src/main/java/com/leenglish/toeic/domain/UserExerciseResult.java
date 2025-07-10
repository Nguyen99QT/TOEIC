package com.leenglish.toeic.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_exercise_results")
public class UserExerciseResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "score", nullable = false)
    private Integer score;

    @Column(name = "answers_correct", nullable = false)
    private Integer answersCorrect;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "time_taken")
    private Integer timeTaken;

    @Column(name = "completed_at", nullable = false)
    private LocalDateTime completedAt;

    // Constructors
    public UserExerciseResult() {
    }

    public UserExerciseResult(User user, Lesson lesson, Exercise exercise, Integer score,
            Integer answersCorrect, Integer totalQuestions, Integer timeTaken,
            LocalDateTime completedAt) {
        this.user = user;
        this.lesson = lesson;
        this.exercise = exercise;
        this.score = score;
        this.answersCorrect = answersCorrect;
        this.totalQuestions = totalQuestions;
        this.timeTaken = timeTaken;
        this.completedAt = completedAt;
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

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
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

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
