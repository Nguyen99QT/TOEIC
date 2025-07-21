package com.leenglish.toeic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.service.AuthenticationService;
import com.leenglish.toeic.service.TokenBlacklistService;
import com.leenglish.toeic.utils.JwtUtils;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private AuthenticationService authenticationService;

    // ========== LOGIN ENDPOINT ==========/
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user with username or email
            User authenticatedUser = authenticationService.authenticateUser(
                loginRequest.getUsername(), 
                loginRequest.getPassword()
            );

            if (authenticatedUser == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Invalid username/email or password");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Generate JWT token with user details
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", authenticatedUser.getRole().toString());
            claims.put("userId", authenticatedUser.getId());
            String token = jwtUtils.generateTokenWithClaims(claims, String.valueOf(authenticatedUser.getUsername()));

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("user", Map.of(
                "id", authenticatedUser.getId(),
                "username", authenticatedUser.getUsername(),
                "email", authenticatedUser.getEmail(),
                "fullName", authenticatedUser.getFullName(),
                "role", authenticatedUser.getRole().toString(),
                "isPremium", authenticatedUser.getIsPremium(),
                "totalScore", authenticatedUser.getTotalScore()
            ));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // ========== LOGIN REQUEST DTO ==========
    
    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // Các phương thức khác như register...

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // Lấy token từ header Authorization
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                // Blacklist token
                tokenBlacklistService.blacklistToken(token, jwtUtils.getExpirationFromToken(token));

                // Clear security context
                SecurityContextHolder.clearContext();

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Logged out successfully");

                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body("No authentication token provided");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Logout failed: " + e.getMessage());
        }
    }

    // ========== VERIFY TOKEN ENDPOINT ==========
    @GetMapping("/verify")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "No authentication token provided");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            String token = authHeader.substring(7);
            
            // Check if token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(token)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Token is blacklisted");
                return ResponseEntity.badRequest().body(errorResponse);
            }

            // Validate token and get username
            String username = jwtUtils.extractUsername(token);
            if (username != null) {
                // Get user from database
                User user = authenticationService.getUserByUsername(username);
                if (user != null) {
                    // Additional token validation can be done here if needed
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("message", "Token is valid");
                    response.put("user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "fullName", user.getFullName(),
                        "role", user.getRole().toString(),
                        "isPremium", user.getIsPremium(),
                        "totalScore", user.getTotalScore()
                    ));
                    return ResponseEntity.ok(response);
                }
            }
            
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Invalid token");
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Token verification failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Auth controller is working");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}
