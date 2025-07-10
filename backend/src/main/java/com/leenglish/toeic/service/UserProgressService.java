package com.leenglish.toeic.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.domain.UserLessonProgress;
import com.leenglish.toeic.dto.UserProgressDto;
import com.leenglish.toeic.repository.LessonRepository;
import com.leenglish.toeic.repository.UserLessonProgressRepository;
import com.leenglish.toeic.repository.UserRepository;

@Service
@Transactional
public class UserProgressService {

    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    public List<UserProgressDto> getUserProgress(Long userId) {
        List<UserLessonProgress> progressList = userLessonProgressRepository
                .findByUserIdOrderByLastAccessedAtDesc(userId);
        return progressList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<UserProgressDto> getCompletedLessons(Long userId) {
        List<UserLessonProgress> progressList = userLessonProgressRepository.findCompletedLessonsByUser(userId);
        return progressList.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public UserProgressDto updateProgress(Long userId, Long lessonId, Integer progressPercentage, Integer timeSpent) {
        Optional<UserLessonProgress> existingProgress = userLessonProgressRepository.findByUserIdAndLessonId(userId,
                lessonId);
        UserLessonProgress progress;

        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setProgressPercentage(progressPercentage);
            progress.setTimeSpentMinutes(progress.getTimeSpentMinutes() + timeSpent);
            progress.setLastAccessedAt(LocalDateTime.now());

            if (progressPercentage >= 100) {
                progress.setStatus("COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
            } else if (progressPercentage > 0) {
                progress.setStatus("IN_PROGRESS");
            }
        } else {
            Optional<User> userOpt = userRepository.findById(userId);
            Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);

            if (!userOpt.isPresent() || !lessonOpt.isPresent()) {
                throw new RuntimeException("User or Lesson not found");
            }

            progress = new UserLessonProgress();
            progress.setUser(userOpt.get());
            progress.setLesson(lessonOpt.get());
            progress.setProgressPercentage(progressPercentage);
            progress.setTimeSpentMinutes(timeSpent);
            progress.setStartedAt(LocalDateTime.now());
            progress.setLastAccessedAt(LocalDateTime.now());

            if (progressPercentage >= 100) {
                progress.setStatus("COMPLETED");
                progress.setCompletedAt(LocalDateTime.now());
            } else if (progressPercentage > 0) {
                progress.setStatus("IN_PROGRESS");
            } else {
                progress.setStatus("NOT_STARTED");
            }
        }

        UserLessonProgress savedProgress = userLessonProgressRepository.save(progress);
        return convertToDto(savedProgress);
    }

    /**
     * Get daily activity for specified number of days
     */
    public Map<String, Object> getDailyActivity(Long userId, Integer days) {
        if (days == null)
            days = 7; // Default 7 days

        try {
            LocalDateTime startDate = LocalDateTime.now().minusDays(days);

            List<UserLessonProgress> recentProgress = userLessonProgressRepository
                    .findByUserIdOrderByLastAccessedAtDesc(userId).stream()
                    .filter(progress -> progress.getLastAccessedAt() != null &&
                            progress.getLastAccessedAt().isAfter(startDate))
                    .collect(Collectors.toList());

            // Group by date and calculate daily metrics
            Map<String, List<UserLessonProgress>> dailyGroups = recentProgress.stream()
                    .collect(Collectors.groupingBy(
                            progress -> progress.getLastAccessedAt().toLocalDate().toString()));

            Map<String, Map<String, Object>> dailyActivity = new LinkedHashMap<>();
            for (Map.Entry<String, List<UserLessonProgress>> entry : dailyGroups.entrySet()) {
                String date = entry.getKey();
                List<UserLessonProgress> dayProgress = entry.getValue();

                Map<String, Object> dayMetrics = new HashMap<>();
                dayMetrics.put("lessonsCount", dayProgress.size());
                dayMetrics.put("completedLessons", dayProgress.stream()
                        .filter(p -> "COMPLETED".equals(p.getStatus())).count());
                dayMetrics.put("totalTimeMinutes", dayProgress.stream()
                        .mapToInt(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes() : 0)
                        .sum());

                dailyActivity.put(date, dayMetrics);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("dailyActivity", dailyActivity);
            result.put("totalDaysActive", dailyActivity.size());
            result.put("averageLessonsPerDay", dailyActivity.values().stream()
                    .mapToLong(day -> (Long) ((Map<String, Object>) day).get("lessonsCount"))
                    .average()
                    .orElse(0.0));
            result.put("totalLessonsInPeriod", recentProgress.size());
            result.put("totalTimeInPeriod", recentProgress.stream()
                    .mapToInt(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes() : 0)
                    .sum());

            return result;
        } catch (Exception e) {
            // Add error logging
            System.err.println("Error getting daily activity for user " + userId + ": " + e.getMessage());
            return new HashMap<>(); // Return empty map on error
        }
    }

    /**
     * Calculate current study streak (consecutive days)
     */
    public Integer calculateStudyStreak(Long userId) {
        List<UserLessonProgress> allProgress = userLessonProgressRepository
                .findByUserIdOrderByLastAccessedAtDesc(userId);

        if (allProgress.isEmpty())
            return 0;

        // Get unique study dates
        Set<LocalDate> studyDates = allProgress.stream()
                .filter(p -> p.getLastAccessedAt() != null)
                .map(p -> p.getLastAccessedAt().toLocalDate())
                .collect(Collectors.toSet());

        List<LocalDate> sortedDates = studyDates.stream()
                .sorted(Collections.reverseOrder())
                .collect(Collectors.toList());

        if (sortedDates.isEmpty())
            return 0;

        int streak = 0;
        LocalDate today = LocalDate.now();
        LocalDate currentDate = today;

        // Check if user studied today or yesterday (allow 1 day gap)
        if (!sortedDates.contains(today)) {
            currentDate = today.minusDays(1);
            if (!sortedDates.contains(currentDate)) {
                return 0; // No recent activity
            }
        }

        // Count consecutive days
        for (LocalDate date : sortedDates) {
            if (date.equals(currentDate)) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else if (date.isBefore(currentDate)) {
                break;
            }
        }

        return streak;
    }

    /**
     * Get weekly progress summary
     */
    public Map<String, Object> getWeeklyProgress(Long userId) {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);

        List<UserLessonProgress> weekProgress = userLessonProgressRepository
                .findByUserIdOrderByLastAccessedAtDesc(userId).stream()
                .filter(progress -> progress.getLastAccessedAt() != null &&
                        progress.getLastAccessedAt().isAfter(startOfWeek))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("totalLessonsThisWeek", weekProgress.size());
        result.put("completedThisWeek", weekProgress.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .count());
        result.put("inProgressThisWeek", weekProgress.stream()
                .filter(p -> "IN_PROGRESS".equals(p.getStatus()))
                .count());
        result.put("averageProgress", weekProgress.stream()
                .mapToInt(UserLessonProgress::getProgressPercentage)
                .average()
                .orElse(0.0));
        result.put("totalTimeThisWeek", weekProgress.stream()
                .mapToInt(p -> p.getTimeSpentMinutes() != null ? p.getTimeSpentMinutes() : 0)
                .sum());

        return result;
    }

    /**
     * Get comprehensive progress summary
     */
    public Map<String, Object> getProgressSummary(Long userId) {
        List<UserLessonProgress> allProgress = userLessonProgressRepository
                .findByUserIdOrderByLastAccessedAtDesc(userId);

        long totalLessons = allProgress.size();
        long completedLessons = allProgress.stream()
                .filter(p -> "COMPLETED".equals(p.getStatus()))
                .count();
        long inProgressLessons = allProgress.stream()
                .filter(p -> "IN_PROGRESS".equals(p.getStatus()))
                .count();

        double overallProgress = calculateOverallProgress(userId);
        int currentStreak = calculateStudyStreak(userId);
        double averageStudyTime = calculateAverageStudyTime(userId);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalLessons", totalLessons);
        summary.put("completedLessons", completedLessons);
        summary.put("inProgressLessons", inProgressLessons);
        summary.put("notStartedLessons", Math.max(0, totalLessons - completedLessons - inProgressLessons));
        summary.put("overallProgress", overallProgress);
        summary.put("completionRate", totalLessons > 0 ? (completedLessons * 100.0 / totalLessons) : 0);
        summary.put("currentStreak", currentStreak);
        summary.put("averageStudyTimeMinutes", averageStudyTime);
        summary.put("totalTimeSpent", getTotalTimeSpent(userId));

        return summary;
    }

    /**
     * Calculate overall progress percentage
     */
    public Double calculateOverallProgress(Long userId) {
        List<UserLessonProgress> allProgress = userLessonProgressRepository
                .findByUserIdOrderByLastAccessedAtDesc(userId);

        if (allProgress.isEmpty())
            return 0.0;

        return allProgress.stream()
                .mapToInt(UserLessonProgress::getProgressPercentage)
                .average()
                .orElse(0.0);
    }

    /**
     * Calculate average study time per completed lesson
     */
    private double calculateAverageStudyTime(Long userId) {
        List<UserLessonProgress> completedLessons = userLessonProgressRepository
                .findCompletedLessonsByUser(userId);

        if (completedLessons.isEmpty())
            return 0.0;

        return completedLessons.stream()
                .filter(p -> p.getTimeSpentMinutes() != null)
                .mapToInt(UserLessonProgress::getTimeSpentMinutes)
                .average()
                .orElse(0.0);
    }

    /**
     * Add time spent to a specific lesson
     */
    public UserProgressDto addTimeSpent(Long userId, Long lessonId, Integer additionalMinutes) {
        Optional<UserLessonProgress> progressOpt = userLessonProgressRepository
                .findByUserIdAndLessonId(userId, lessonId);

        if (progressOpt.isPresent()) {
            UserLessonProgress progress = progressOpt.get();
            Integer currentTime = progress.getTimeSpentMinutes() != null ? progress.getTimeSpentMinutes() : 0;
            progress.setTimeSpentMinutes(currentTime + additionalMinutes);
            progress.setLastAccessedAt(LocalDateTime.now());

            UserLessonProgress savedProgress = userLessonProgressRepository.save(progress);
            return convertToDto(savedProgress);
        }

        return null;
    }

    public Long getCompletedLessonsCount(Long userId) {
        return userLessonProgressRepository.countCompletedLessonsByUser(userId);
    }

    public Double getAverageProgress(Long userId) {
        return userLessonProgressRepository.getAverageProgressByUser(userId);
    }

    public Long getTotalTimeSpent(Long userId) {
        return userLessonProgressRepository.getTotalTimeSpentByUser(userId);
    }

    private UserProgressDto convertToDto(UserLessonProgress progress) {
        return new UserProgressDto(
                progress.getId(),
                progress.getUser().getId(),
                progress.getLesson().getId(),
                progress.getLesson().getTitle(),
                progress.getStatus(),
                progress.getProgressPercentage(),
                progress.getTimeSpentMinutes(),
                progress.getStartedAt(),
                progress.getCompletedAt(),
                progress.getLastAccessedAt());
    }
}
