package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.domain.UserActivity;
import com.leenglish.toeic.domain.UserStats;
import com.leenglish.toeic.dto.DashboardDto;
import com.leenglish.toeic.repository.UserActivityRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.repository.UserStatsRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ================================================================
 * DASHBOARD SERVICE - Tích hợp Backend với Frontend
 * ================================================================
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class DashboardService {

        private final UserRepository userRepository;
        private final UserStatsRepository userStatsRepository;
        private final UserActivityRepository userActivityRepository;

        /**
         * Lấy toàn bộ dashboard data cho user
         */
        public DashboardDto getDashboardData(String username) {
                try {
                        log.info("Getting dashboard data for user: {}", username);

                        User user = userRepository.findByUsername(username)
                                        .orElseThrow(() -> new RuntimeException("User not found: " + username));

                        // 1. Get user stats - create DTO directly to avoid entity issues
                        DashboardDto.UserStatsDto userStatsDto = getUserStatsDto(user.getId());

                        // 2. Get recent activities
                        DashboardDto.RecentActivitiesDto recentActivitiesDto = getRecentActivities(username, 10);

                        // 3. Generate mock weekly progress
                        DashboardDto.WeeklyProgressDto weeklyProgressDto = generateWeeklyProgress();

                        return DashboardDto.builder()
                                        .userStats(userStatsDto)
                                        .recentActivities(recentActivitiesDto)
                                        .weeklyProgress(weeklyProgressDto)
                                        .build();
                } catch (Exception e) {
                        log.error("Error getting dashboard data: {}", e.getMessage(), e);
                        throw e;
                }
        }

        /**
         * Get user stats DTO - handles both existing and default cases
         */
        private DashboardDto.UserStatsDto getUserStatsDto(Long userId) {
                UserStats userStats = userStatsRepository.findByUserId(userId).orElse(null);

                if (userStats != null) {
                        // Convert existing UserStats to DTO
                        return convertUserStatsToDto(userStats);
                } else {
                        // Create default DTO directly
                        return createDefaultUserStatsDtoReadOnly(userId);
                }
        }

        /**
         * Lấy chỉ user stats
         */
        public DashboardDto.UserStatsDto getUserStats(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found: " + username));

                return getUserStatsDto(user.getId());
        }

        /**
         * Lấy chỉ recent activities
         */
        public DashboardDto.RecentActivitiesDto getRecentActivities(String username, int limit) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found: " + username));

                List<UserActivity> activities = userActivityRepository
                                .findTop10ByUserIdAndIsActiveTrueOrderByCreatedAtDesc(user.getId());

                List<DashboardDto.RecentActivitiesDto.UserActivityDto> activityDtos = activities.stream()
                                .limit(limit)
                                .map(this::convertActivityToDto)
                                .collect(Collectors.toList());

                return DashboardDto.RecentActivitiesDto.builder()
                                .activities(activityDtos)
                                .build();
        }

        // ================================================================
        // HELPER METHODS
        // ================================================================

        /**
         * Convert UserStats entity to DTO
         */
        private DashboardDto.UserStatsDto convertUserStatsToDto(UserStats userStats) {
                return DashboardDto.UserStatsDto.builder()
                                .id(userStats.getId())
                                .userId(userStats.getUser() != null ? userStats.getUser().getId() : null)
                                .lessonsCompleted(userStats.getLessonsCompleted())
                                .practiceTests(userStats.getPracticeTests())
                                .averageScore(userStats.getAverageScore()) // This should work if UserStats returns
                                                                           // Double
                                .studyStreak(userStats.getStudyStreak())
                                .totalStudyTime(userStats.getTotalStudyTime())
                                .totalFlashcardsStudied(userStats.getTotalFlashcardsStudied())
                                .highestScore(userStats.getHighestScore())
                                .lastStudyDate(userStats.getLastStudyDate())
                                .createdAt(userStats.getCreatedAt())
                                .updatedAt(userStats.getUpdatedAt())
                                .isActive(userStats.getIsActive())
                                .build();
        }

        /**
         * Create default stats DTO directly (without entity creation)
         */
        private DashboardDto.UserStatsDto createDefaultUserStatsDtoReadOnly(Long userId) {
                log.info("Creating default user stats DTO (read-only) for user ID: {}", userId);

                return DashboardDto.UserStatsDto.builder()
                                .id(null)
                                .userId(userId)
                                .lessonsCompleted(0)
                                .practiceTests(0)
                                .averageScore(0.0) // Use Double instead of BigDecimal.ZERO
                                .studyStreak(0)
                                .totalStudyTime(0)
                                .totalFlashcardsStudied(0)
                                .highestScore(0)
                                .lastStudyDate(null)
                                .createdAt(LocalDateTime.now())
                                .updatedAt(LocalDateTime.now())
                                .isActive(true)
                                .build();
        }

        private DashboardDto.RecentActivitiesDto.UserActivityDto convertActivityToDto(UserActivity activity) {
                return DashboardDto.RecentActivitiesDto.UserActivityDto.builder()
                                .id(activity.getId())
                                .userId(activity.getUser().getId())
                                .type(activity.getType().name())
                                .title(activity.getTitle())
                                .description(activity.getDescription())
                                .score(activity.getScore())
                                .durationMinutes(activity.getDurationMinutes())
                                .pointsEarned(activity.getPointsEarned())
                                .lessonId(activity.getLessonId())
                                .flashcardSetId(activity.getFlashcardSetId())
                                .exerciseId(activity.getExerciseId())
                                .createdAt(activity.getCreatedAt())
                                .isActive(activity.getIsActive())
                                .build();
        }

        private DashboardDto.WeeklyProgressDto generateWeeklyProgress() {
                // Mock data for weekly progress - trong thực tế sẽ query từ database
                List<DashboardDto.WeeklyProgressDto.DayProgressDto> weeklyData = Arrays.asList(
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Mon").score(75).activitiesCount(3).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Tue").score(82).activitiesCount(2).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Wed").score(78).activitiesCount(4).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Thu").score(85).activitiesCount(1).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Fri").score(90).activitiesCount(3).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Sat").score(88).activitiesCount(2).build(),
                                DashboardDto.WeeklyProgressDto.DayProgressDto.builder()
                                                .day("Sun").score(92).activitiesCount(1).build());

                return DashboardDto.WeeklyProgressDto.builder()
                                .weeklyProgress(weeklyData)
                                .build();
        }
}
