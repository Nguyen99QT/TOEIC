package com.leenglish.toeic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.service.ExerciseService; // ENABLED
import com.leenglish.toeic.service.LessonService;
import com.leenglish.toeic.security.UserDetailsImpl;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private ExerciseService exerciseService; // ENABLED
    
    @Autowired
    private LessonService lessonService;    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get statistics for admin dashboard
            long totalUsers = userService.getTotalUserCount();
            long totalExercises = exerciseService.getTotalExerciseCount(); // ENABLED
            long totalLessons = lessonService.getTotalLessonCount();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUsers", totalUsers);
            stats.put("totalExercises", totalExercises); // ENABLED
            stats.put("totalLessons", totalLessons);
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

    // Debug endpoint to check user roles and authorities
    @GetMapping("/debug/user-info")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserInfo(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("username", userDetails.getUsername());
            userInfo.put("authorities", userDetails.getAuthorities().toString());
            userInfo.put("authoritiesDetail", userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toList()));
            userInfo.put("isEnabled", userDetails.isEnabled());
            userInfo.put("isAccountNonExpired", userDetails.isAccountNonExpired());
            userInfo.put("isAccountNonLocked", userDetails.isAccountNonLocked());
            userInfo.put("isCredentialsNonExpired", userDetails.isCredentialsNonExpired());

            // Test specific role checks
            userInfo.put("hasRoleUser", userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER")));
            userInfo.put("hasRoleCollaborator", userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_COLLABORATOR")));
            userInfo.put("hasRoleAdmin", userDetails.getAuthorities().stream()
                    .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN")));

            response.put("success", true);
            response.put("userInfo", userInfo);
            response.put("message", "User info retrieved successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to retrieve user info: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/users/{userId}/promote-to-collaborator")
    public ResponseEntity<Map<String, Object>> promoteToCollaborator(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.promoteToCollaborator(userId);
            response.put("success", true);
            response.put("message", "User promoted to collaborator successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to promote user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/users/promote-by-username/{username}")
    public ResponseEntity<Map<String, Object>> promoteToCollaboratorByUsername(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();

        try {
            userService.promoteToCollaboratorByUsername(username);
            response.put("success", true);
            response.put("message", "User " + username + " promoted to collaborator successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to promote user: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
