package com.leenglish.toeic.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "lessons")
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "content", columnDefinition = "TEXT")
    private String content;

    @Column(name = "level", length = 10)
    private String level;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "audio_url", length = 500)
    private String audioUrl;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "order_index")
    private Integer orderIndex = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "type", length = 50)
    private String type;

    @Column(name = "difficulty", length = 50)
    private String difficulty;

    @Column(name = "duration")
    private Integer duration;

    // Constructors
    public Lesson() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Lesson(String title, String description, String level) {
        this();
        this.title = title;
        this.description = description;
        this.level = level;
    }

    public Lesson(String title, String description, String content, String level, Boolean isPremium) {
        this();
        this.title = title;
        this.description = description;
        this.content = content;
        this.level = level;
        this.isPremium = isPremium;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
        this.updatedAt = LocalDateTime.now();
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
        this.updatedAt = LocalDateTime.now();
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
        this.updatedAt = LocalDateTime.now();
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
        this.updatedAt = LocalDateTime.now();
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    // Business Logic Methods
    public boolean isPremiumLesson() {
        return isPremium != null && isPremium;
    }

    public boolean hasAudio() {
        return audioUrl != null && !audioUrl.trim().isEmpty();
    }

    public boolean hasImage() {
        return imageUrl != null && !imageUrl.trim().isEmpty();
    }

    public boolean isValid() {
        return title != null && !title.trim().isEmpty();
    }

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (isActive == null)
            isActive = true;
        if (isPremium == null)
            isPremium = false;
        if (orderIndex == null)
            orderIndex = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
