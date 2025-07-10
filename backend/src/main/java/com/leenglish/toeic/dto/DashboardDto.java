package com.leenglish.toeic.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ================================================================
 * DASHBOARD DTO - Khớp với Frontend Dashboard Types
 * ================================================================
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDto {

    private UserStatsDto userStats;
    private RecentActivitiesDto recentActivities;
    private WeeklyProgressDto weeklyProgress;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatsDto {
        private Long id;
        private Long userId;
        private Integer lessonsCompleted;
        private Integer practiceTests;
        private Double averageScore;
        private Integer studyStreak;
        private Integer totalStudyTime; // in minutes
        private Integer totalFlashcardsStudied;
        private Integer highestScore;
        private LocalDateTime lastStudyDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private Boolean isActive;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentActivitiesDto {
        private List<UserActivityDto> activities;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class UserActivityDto {
            private Long id;
            private Long userId;
            private String type; // ActivityType as string
            private String title;
            private String description;
            private Integer score;
            private Integer durationMinutes;
            private Integer pointsEarned;
            private Long lessonId;
            private Long flashcardSetId;
            private Long exerciseId;
            private LocalDateTime createdAt;
            private Boolean isActive;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyProgressDto {
        private List<DayProgressDto> weeklyProgress;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class DayProgressDto {
            private String day;
            private Integer score;
            private Integer activitiesCount;
        }
    }
}
