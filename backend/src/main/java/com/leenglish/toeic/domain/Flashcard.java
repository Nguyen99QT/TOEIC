package com.leenglish.toeic.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "flashcards")
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "flashcard_set_id", nullable = false)
    private FlashcardSet flashcardSet;

    @Column(name = "front_text", nullable = false, length = 1000)
    private String frontText;

    @Column(name = "back_text", nullable = false, length = 2000)
    private String backText;

    // ✅ Add hint field to match frontend
    @Column(name = "hint", length = 500)
    private String hint;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;

    @Column(name = "difficulty")
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    // ✅ Add difficultyLevel to match frontend
    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    // ✅ Add tags field to match frontend
    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "term")
    private String term;

    @Column(name = "definition")
    private String definition;

    @Column(name = "example")
    private String example;

    @Column(name = "level")
    private String level;

    @Column(name = "category")
    private String category;

    // ✅ Add enums for difficulty
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }

    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    // ========== CONSTRUCTORS ==========
    public Flashcard() {
    }

    public Flashcard(FlashcardSet flashcardSet, String frontText, String backText) {
        this.flashcardSet = flashcardSet;
        this.frontText = frontText;
        this.backText = backText;
    }

    // ========== GETTERS AND SETTERS ==========
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FlashcardSet getFlashcardSet() {
        return flashcardSet;
    }

    public void setFlashcardSet(FlashcardSet flashcardSet) {
        this.flashcardSet = flashcardSet;
    }

    // ✅ Add convenience method to get setId for frontend compatibility
    public Long getSetId() {
        return flashcardSet != null ? flashcardSet.getId() : null;
    }

    public String getFrontText() {
        return frontText;
    }

    public void setFrontText(String frontText) {
        this.frontText = frontText;
    }

    public String getBackText() {
        return backText;
    }

    public void setBackText(String backText) {
        this.backText = backText;
    }

    // ✅ Hint getter/setter
    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    // ✅ DifficultyLevel getter/setter
    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    // ✅ Tags getter/setter
    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
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

    // Getter & Setter cho term
    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    // Getter & Setter cho definition
    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    // Getter & Setter cho example
    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    // Getter & Setter cho level
    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    // Getter & Setter cho category
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // ========== UTILITY METHODS ==========
    @Override
    public String toString() {
        return "Flashcard{" +
                "id=" + id +
                ", frontText='" + frontText + '\'' +
                ", backText='" + backText + '\'' +
                ", hint='" + hint + '\'' +
                ", orderIndex=" + orderIndex +
                ", difficulty=" + difficulty +
                ", difficultyLevel=" + difficultyLevel +
                ", tags='" + tags + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}
