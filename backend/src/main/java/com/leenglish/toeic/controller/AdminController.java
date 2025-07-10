package com.leenglish.toeic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.service.ExerciseService;
import com.leenglish.toeic.service.LessonService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ExerciseService exerciseService;

    @Autowired
    private LessonService lessonService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get statistics for admin dashboard
            long totalUsers = userService.getTotalUserCount();
            long totalExercises = exerciseService.getTotalExerciseCount();
            long totalLessons = lessonService.getTotalLessonCount();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalExercises", totalExercises);
            stats.put("totalLessons", totalLessons);

            response.put("success", true);
            response.put("stats", stats);
            response.put("message", "Admin dashboard data retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve dashboard data: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> response = new HashMap<>();

        try {
            response.put("success", true);
            response.put("users", userService.getAllUsers());
            response.put("message", "Users retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve users: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<Map<String, Object>> activateUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.activateUser(userId);
            response.put("success", true);
            response.put("message", "User activated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to activate user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/users/{userId}/deactivate")
    public ResponseEntity<Map<String, Object>> deactivateUser(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.deactivateUser(userId);
            response.put("success", true);
            response.put("message", "User deactivated successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to deactivate user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "UP");
            health.put("timestamp", System.currentTimeMillis());
            health.put("version", "1.0.0");

            response.put("success", true);
            response.put("health", health);
            response.put("message", "System health retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve system health: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
