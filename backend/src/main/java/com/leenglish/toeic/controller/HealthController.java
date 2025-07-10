package com.leenglish.toeic.controller;

import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller to provide health check endpoints
 * Used to verify if the API is running correctly
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class HealthController {

    @Autowired(required = false)
    private DataSource dataSource;

    /**
     * Basic health check endpoint
     * Returns a 200 OK response with a timestamp and status
     * This endpoint will ALWAYS return 200 OK even if database is down
     * 
     * @return ResponseEntity with health status information
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();

        try {
            response.put("status", "UP");
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("service", "TOEIC Platform API");
            response.put("version", "1.0.0");
            response.put("message", "Health check endpoint is working");

            // Memory information
            Runtime runtime = Runtime.getRuntime();
            Map<String, Object> memory = new HashMap<>();
            memory.put("total", runtime.totalMemory() / (1024 * 1024) + " MB");
            memory.put("free", runtime.freeMemory() / (1024 * 1024) + " MB");
            memory.put("used", (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024) + " MB");
            memory.put("maxMemory", runtime.maxMemory() / (1024 * 1024) + " MB");
            response.put("memory", memory);

            // Database health check (non-blocking)
            Map<String, Object> database = new HashMap<>();
            if (dataSource != null) {
                try (Connection connection = dataSource.getConnection()) {
                    boolean isValid = connection.isValid(3); // Reduced timeout
                    database.put("status", isValid ? "UP" : "DOWN");
                    database.put("url", connection.getMetaData().getURL());
                    database.put("productName", connection.getMetaData().getDatabaseProductName());
                    database.put("productVersion", connection.getMetaData().getDatabaseProductVersion());
                    database.put("message", "Database connection successful");

                } catch (Exception e) {
                    database.put("status", "DOWN");
                    database.put("error", e.getMessage());
                    database.put("message", "Database connection failed - This is expected if MySQL is not running");

                    // Log database error but don't fail the health check
                    System.err.println("⚠️ Database health check failed: " + e.getMessage());
                }
            } else {
                database.put("status", "NOT_CONFIGURED");
                database.put("message", "DataSource not available");
            }
            response.put("database", database);

            // Application info
            Map<String, Object> application = new HashMap<>();
            application.put("name", "TOEIC Learning Platform");
            application.put("environment", "development");
            application.put("java_version", System.getProperty("java.version"));
            application.put("spring_active_profiles", System.getProperty("spring.profiles.active", "default"));
            response.put("application", application);

            // ALWAYS return 200 OK - health endpoint should indicate server is running
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Even if there's an exception, return basic health info
            response.clear();
            response.put("status", "PARTIAL");
            response.put("error", e.getMessage());
            response.put("timestamp", LocalDateTime.now().toString());
            response.put("message", "Health check completed with errors");

            return ResponseEntity.ok(response); // Still return 200 OK
        }
    }

    /**
     * Simple health check endpoint
     * 
     * @return ResponseEntity with a simple health status message
     */
    @GetMapping("/health/simple")
    public ResponseEntity<String> simpleHealthCheck() {
        return ResponseEntity.ok("OK - TOEIC Platform API is running");
    }
}
