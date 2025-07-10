package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "lessons_completed", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer lessonsCompleted = 0;

    @Column(name = "practice_tests", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer practiceTests = 0;

    @Column(name = "average_score", nullable = false, columnDefinition = "DECIMAL(5,2) DEFAULT 0.00")
    private Double averageScore = 0.0;

    @Column(name = "study_streak", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer studyStreak = 0;

    @Column(name = "total_study_time", nullable = false, columnDefinition = "INT DEFAULT 0") // in minutes
    private Integer totalStudyTime = 0;

    @Column(name = "total_flashcards_studied", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer totalFlashcardsStudied = 0;

    @Column(name = "highest_score", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer highestScore = 0;

    @Column(name = "last_study_date")
    private LocalDateTime lastStudyDate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private Boolean isActive = true;
}
