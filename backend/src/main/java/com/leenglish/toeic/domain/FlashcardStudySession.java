package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "flashcard_study_sessions")
public class FlashcardStudySession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_set_id", nullable = false)
    private FlashcardSet flashcardSet;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "study_mode", nullable = false)
    private StudyMode studyMode;
    
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;
    
    @Column(name = "end_time")
    private LocalDateTime endTime;
    
    @Column(name = "correct_answers", nullable = false)
    private Integer correctAnswers = 0;
    
    @Column(name = "wrong_answers", nullable = false)
    private Integer wrongAnswers = 0;
    
    @Column(name = "total_time_spent")
    private Integer totalTimeSpent = 0;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SessionStatus status = SessionStatus.ACTIVE;
    
    @Column(name = "accuracy")
    private Double accuracy = 0.0;
    
    @ElementCollection
    @CollectionTable(name = "session_studied_cards", joinColumns = @JoinColumn(name = "session_id"))
    @Column(name = "card_id")
    private Set<Long> studiedCards = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "session_mastered_cards", joinColumns = @JoinColumn(name = "session_id"))
    @Column(name = "card_id")
    private Set<Long> masteredCards = new HashSet<>();
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Enums
    public enum StudyMode {
        FLASHCARD, QUIZ, REVIEW, SPACED_REPETITION
    }
    
    public enum SessionStatus {
        ACTIVE, COMPLETED, PAUSED, ABANDONED
    }
    
    // Constructors
    public FlashcardStudySession() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // PrePersist and PreUpdate
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
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public FlashcardSet getFlashcardSet() { return flashcardSet; }
    public void setFlashcardSet(FlashcardSet flashcardSet) { this.flashcardSet = flashcardSet; }
    
    public StudyMode getStudyMode() { return studyMode; }
    public void setStudyMode(StudyMode studyMode) { this.studyMode = studyMode; }
    
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    
    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
    
    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
    
    public Integer getWrongAnswers() { return wrongAnswers; }
    public void setWrongAnswers(Integer wrongAnswers) { this.wrongAnswers = wrongAnswers; }
    
    public Integer getTotalTimeSpent() { return totalTimeSpent; }
    public void setTotalTimeSpent(Integer totalTimeSpent) { this.totalTimeSpent = totalTimeSpent; }
    
    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }
    
    public Double getAccuracy() { return accuracy; }
    public void setAccuracy(Double accuracy) { this.accuracy = accuracy; }
    
    public Set<Long> getStudiedCards() { return studiedCards; }
    public void setStudiedCards(Set<Long> studiedCards) { this.studiedCards = studiedCards; }
    
    public Set<Long> getMasteredCards() { return masteredCards; }
    public void setMasteredCards(Set<Long> masteredCards) { this.masteredCards = masteredCards; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public Integer getTotalAnswers() {
        return correctAnswers + wrongAnswers;
    }
    
    public Double calculateAccuracy() {
        if (getTotalAnswers() == 0) return 0.0;
        return (double) correctAnswers / getTotalAnswers() * 100.0;
    }
    
    public Long getTimeSpentSeconds() {
        return totalTimeSpent != null ? totalTimeSpent.longValue() : 0L;
    }
}