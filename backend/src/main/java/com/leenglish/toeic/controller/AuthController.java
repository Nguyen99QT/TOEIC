package com.leenglish.toeic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    // Các phương thức khác như login, register...

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
}
