package com.leenglish.toeic.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.leenglish.toeic.enums.DifficultyLevel;
// import Prepersist
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
//import enumerate
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "questions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(name = "question_text", nullable = false, length = 500)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType;

    // Answer Options
    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @Column(name = "explanation")
    private String explanation;

    // ADD THIS: Difficulty Level field
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", nullable = false)
    @Builder.Default
    private DifficultyLevel difficultyLevel = DifficultyLevel.EASY;

    @Column(name = "points", nullable = false)
    @Builder.Default
    private Integer points = 1;

    @Column(name = "question_order")
    private Integer questionOrder;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
