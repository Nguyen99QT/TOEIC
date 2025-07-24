package com.leenglish.toeic.dto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class FlashcardStudySessionDto {
    private Long id;
    private Long userId;
    private Long flashcardSetId;
    private String studyMode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer correctAnswers = 0;
    private Integer wrongAnswers = 0;
    private Integer totalTimeSpent = 0;
    private String status;
    private Double accuracy = 0.0;
    private Set<Long> studiedCards = new HashSet<>();
    private Set<Long> masteredCards = new HashSet<>();

    // Constructors
    public FlashcardStudySessionDto() {
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

    public Long getFlashcardSetId() {
        return flashcardSetId;
    }

    public void setFlashcardSetId(Long flashcardSetId) {
        this.flashcardSetId = flashcardSetId;
    }

    public String getStudyMode() {
        return studyMode;
    }

    public void setStudyMode(String studyMode) {
        this.studyMode = studyMode;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getWrongAnswers() {
        return wrongAnswers;
    }

    public void setWrongAnswers(Integer wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }

    public Integer getTotalTimeSpent() {
        return totalTimeSpent;
    }

    public void setTotalTimeSpent(Integer totalTimeSpent) {
        this.totalTimeSpent = totalTimeSpent;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(Double accuracy) {
        this.accuracy = accuracy;
    }

    public Set<Long> getStudiedCards() {
        return studiedCards;
    }

    public void setStudiedCards(Set<Long> studiedCards) {
        this.studiedCards = studiedCards;
    }

    public Set<Long> getMasteredCards() {
        return masteredCards;
    }

    public void setMasteredCards(Set<Long> masteredCards) {
        this.masteredCards = masteredCards;
    }
}