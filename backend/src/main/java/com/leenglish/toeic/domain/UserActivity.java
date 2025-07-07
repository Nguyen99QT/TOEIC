package com.leenglish.toeic.domain;

import com.leenglish.toeic.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Integer score;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "points_earned")
    @Builder.Default // ✅ Fix Builder warning
    private Integer pointsEarned = 0;

    @Column(name = "lesson_id")
    private Long lessonId;

    @Column(name = "flashcard_set_id")
    private Long flashcardSetId;

    @Column(name = "exercise_id")
    private Long exerciseId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "is_active")
    @Builder.Default // ✅ Fix Builder warning
    private Boolean isActive = true;
}
