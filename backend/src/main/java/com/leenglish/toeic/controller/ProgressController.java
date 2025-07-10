
package com.leenglish.toeic.controller;

import com.leenglish.toeic.dto.UserProgressDto;
import com.leenglish.toeic.service.UserProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private UserProgressService userProgressService;

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<UserProgressDto>> getUserProgress(@PathVariable Long userId) {
        List<UserProgressDto> progress = userProgressService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }

    @GetMapping("/user/{userId}/completed")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<UserProgressDto>> getCompletedLessons(@PathVariable Long userId) {
        List<UserProgressDto> completedLessons = userProgressService.getCompletedLessons(userId);
        return ResponseEntity.ok(completedLessons);
    }

    @PostMapping("/update")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<UserProgressDto> updateProgress(
            @RequestParam Long userId,
            @RequestParam Long lessonId,
            @RequestParam Integer progressPercentage,
            @RequestParam Integer timeSpent) {
        UserProgressDto updatedProgress = userProgressService.updateProgress(userId, lessonId, progressPercentage,
                timeSpent);
        return ResponseEntity.ok(updatedProgress);
    }

    @GetMapping("/user/{userId}/stats/completed-count")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getCompletedLessonsCount(@PathVariable Long userId) {
        Long count = userProgressService.getCompletedLessonsCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}/stats/average-progress")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Double> getAverageProgress(@PathVariable Long userId) {
        Double average = userProgressService.getAverageProgress(userId);
        return ResponseEntity.ok(average);
    }

    @GetMapping("/user/{userId}/stats/total-time")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalTimeSpent(@PathVariable Long userId) {
        Long totalTime = userProgressService.getTotalTimeSpent(userId);
        return ResponseEntity.ok(totalTime);
    }

    /**
     * Get daily activity for file length day tracking
     */
    @GetMapping("/user/{userId}/daily-activity")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getDailyActivity(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") Integer days) {
        Map<String, Object> dailyActivity = userProgressService.getDailyActivity(userId, days);
        return ResponseEntity.ok(dailyActivity);
    }

    /**
     * Get current study streak
     */
    @GetMapping("/user/{userId}/stats/streak")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Integer> getStudyStreak(@PathVariable Long userId) {
        Integer streak = userProgressService.calculateStudyStreak(userId);
        return ResponseEntity.ok(streak);
    }

    /**
     * Get weekly progress summary
     */
    @GetMapping("/user/{userId}/weekly-progress")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getWeeklyProgress(@PathVariable Long userId) {
        Map<String, Object> weeklyProgress = userProgressService.getWeeklyProgress(userId);
        return ResponseEntity.ok(weeklyProgress);
    }

    /**
     * Get comprehensive progress summary
     */
    @GetMapping("/user/{userId}/summary")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getProgressSummary(@PathVariable Long userId) {
        Map<String, Object> summary = userProgressService.getProgressSummary(userId);
        return ResponseEntity.ok(summary);
    }

    /**
     * Get overall progress percentage
     */
    @GetMapping("/user/{userId}/stats/overall-progress")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Double> getOverallProgress(@PathVariable Long userId) {
        Double overallProgress = userProgressService.calculateOverallProgress(userId);
        return ResponseEntity.ok(overallProgress);
    }

    /**
     * Add time spent to a lesson (for file length day tracking)
     */
    @PutMapping("/user/{userId}/lesson/{lessonId}/add-time")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<UserProgressDto> addTimeSpent(
            @PathVariable Long userId,
            @PathVariable Long lessonId,
            @RequestBody Map<String, Integer> timeData) {
        Integer additionalMinutes = timeData.get("additionalMinutes");
        UserProgressDto progress = userProgressService.addTimeSpent(userId, lessonId, additionalMinutes);
        if (progress != null) {
            return ResponseEntity.ok(progress);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<UserProgressDto>> getMyProgress(Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        List<UserProgressDto> progress = userProgressService.getUserProgress(userId);
        return ResponseEntity.ok(progress);
    }

    /**
     * Get my daily activity
     */
    @GetMapping("/my/daily-activity")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyDailyActivity(
            @RequestParam(defaultValue = "7") Integer days,
            Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        Map<String, Object> dailyActivity = userProgressService.getDailyActivity(userId, days);
        return ResponseEntity.ok(dailyActivity);
    }

    /**
     * Get my study streak
     */
    @GetMapping("/my/streak")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Integer> getMyStudyStreak(Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        Integer streak = userProgressService.calculateStudyStreak(userId);
        return ResponseEntity.ok(streak);
    }

    /**
     * Get my progress summary
     */
    @GetMapping("/my/summary")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyProgressSummary(Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        Map<String, Object> summary = userProgressService.getProgressSummary(userId);
        return ResponseEntity.ok(summary);
    }
}
