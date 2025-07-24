package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "flashcard_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardSet {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 1000)
    private String description;
    
    @Column(name = "difficulty_level")
    private String difficultyLevel;
    
    @Column(nullable = false)
    private String category;
    
    @Column(name = "is_public")
    private Boolean isPublic = false;
    
    @Column(name = "is_featured")
    private Boolean isFeatured = false;
    
    @Column(name = "is_premium")
    private Boolean isPremium = false;
    
    @Column(name = "estimated_time_minutes")
    private Integer estimatedTimeMinutes = 0;
    
    @Column(name = "view_count")
    private Integer viewCount = 0;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "flashcardSet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Flashcard> flashcards;
    
    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
