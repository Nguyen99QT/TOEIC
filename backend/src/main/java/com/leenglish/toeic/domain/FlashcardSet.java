package com.leenglish.toeic.domain;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "flashcard_sets")
public class FlashcardSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String category;
    private String level; // Thêm
    private Integer cardCount; // Thêm
    private Boolean isPublic;
    private Boolean isActive;
    private Boolean isPremium;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer viewCount = 0;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToMany(mappedBy = "flashcardSet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flashcard> flashcards = new ArrayList<>();

    // ========== CONSTRUCTORS ==========
    public FlashcardSet() {
    }

    public FlashcardSet(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // ========== GETTERS AND SETTERS ==========
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // ✅ Add title getter for frontend compatibility
    public String getTitle() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    // ✅ isPremium getter/setter
    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    // ✅ isPublic getter/setter
    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getCardCount() {
        return cardCount;
    }

    public void setCardCount(Integer cardCount) {
        this.cardCount = cardCount;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
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

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public List<Flashcard> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<Flashcard> flashcards) {
        this.flashcards = flashcards;
    }

    // ========== UTILITY METHODS ==========
    public void addFlashcard(Flashcard flashcard) {
        flashcards.add(flashcard);
        flashcard.setFlashcardSet(this);
    }

    public void removeFlashcard(Flashcard flashcard) {
        flashcards.remove(flashcard);
        flashcard.setFlashcardSet(null);
    }

    // ✅ Computed properties for frontend compatibility
    public Integer getTotalCards() {
        return flashcards != null ? flashcards.size() : 0;
    }

    public void incrementViewCount() {
        this.viewCount = (this.viewCount != null ? this.viewCount : 0) + 1;
    }

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    @Column(name = "tags", length = 500)
    private String tags;

    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes;

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public Integer getEstimatedTimeMinutes() {
        return estimatedTimeMinutes;
    }

    public void setEstimatedTimeMinutes(Integer estimatedTimeMinutes) {
        this.estimatedTimeMinutes = estimatedTimeMinutes;
    }

    @Override
    public String toString() {
        return "FlashcardSet{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", isPremium=" + isPremium +
                ", isPublic=" + isPublic +
                ", difficultyLevel=" + difficultyLevel +
                ", viewCount=" + viewCount +
                ", isActive=" + isActive +
                '}';
    }
}
