package com.leenglish.toeic.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.dto.DashboardDto;
import com.leenglish.toeic.service.DashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ================================================================
 * DASHBOARD CONTROLLER - Tích hợp Frontend & Backend
 * ================================================================
 */
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Main dashboard endpoint
     */
    @GetMapping
    public ResponseEntity<?> getDashboardData(Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("=== DASHBOARD REQUEST START ===");
            log.info("User: {}", username);
            log.info("Authorities: {}", authentication.getAuthorities());

            DashboardDto dashboardData = dashboardService.getDashboardData(username);

            log.info("=== DASHBOARD REQUEST SUCCESS ===");
            return ResponseEntity.ok(dashboardData);

        } catch (Exception e) {
            log.error("=== DASHBOARD ERROR ===");
            log.error("Error class: {}", e.getClass().getSimpleName());
            log.error("Error message: {}", e.getMessage());
            log.error("Stack trace: ", e);

            Map<String, Object> errorResponse = Map.of(
                    "error", true,
                    "message", e.getMessage(),
                    "type", e.getClass().getSimpleName(),
                    "user", authentication.getName(),
                    "timestamp", LocalDateTime.now().toString());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * Debug endpoint to check user authentication details
     */
    @GetMapping("/debug-auth")
    public ResponseEntity<Map<String, Object>> debugAuth(Authentication authentication) {
        try {
            log.info("DEBUG AUTH: User = {}", authentication.getName());
            log.info("DEBUG AUTH: Authorities = {}", authentication.getAuthorities());
            log.info("DEBUG AUTH: Principal = {}", authentication.getPrincipal());

            Map<String, Object> response = new HashMap<>();
            response.put("username", authentication.getName());
            response.put("authorities", authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
            response.put("principalClass", authentication.getPrincipal().getClass().getSimpleName());
            response.put("authenticated", authentication.isAuthenticated());
            response.put("timestamp", LocalDateTime.now().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("ERROR in debug-auth endpoint: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Simple test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Dashboard API is working!");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    /**
     * Get user stats only
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardDto.UserStatsDto> getUserStats(Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("Getting user stats for: {}", username);

            DashboardDto.UserStatsDto userStats = dashboardService.getUserStats(username);
            return ResponseEntity.ok(userStats);
        } catch (Exception e) {
            log.error("Error getting user stats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Get recent activities only
     */
    @GetMapping("/activities")
    public ResponseEntity<DashboardDto.RecentActivitiesDto> getRecentActivities(Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("Getting recent activities for: {}", username);

            DashboardDto.RecentActivitiesDto activities = dashboardService.getRecentActivities(username, 10);
            return ResponseEntity.ok(activities);
        } catch (Exception e) {
            log.error("Error getting recent activities: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
