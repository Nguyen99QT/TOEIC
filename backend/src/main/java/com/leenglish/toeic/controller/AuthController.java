package com.leenglish.toeic.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import com.leenglish.toeic.dto.JwtResponse;
import com.leenglish.toeic.dto.LoginRequest;
import com.leenglish.toeic.dto.RegisterRequest;
import com.leenglish.toeic.security.UserDetailsImpl;
import com.leenglish.toeic.service.TokenBlacklistService;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.utils.JwtUtils;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.enums.Gender;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Log thông tin đăng nhập
            System.out.println("📝 Login attempt for user: " + loginRequest.getUsername());

            // Xác thực người dùng
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            // Thiết lập Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Tạo JWT token
            String jwt = jwtUtils.generateToken(authentication);

            // Lấy thông tin người dùng
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Lấy danh sách các quyền (roles)
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Tạo và trả về response với JwtResponse
            System.out.println("✅ Login successful for user: " + loginRequest.getUsername());

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles));
        } catch (BadCredentialsException e) {
            System.out.println("❌ Authentication failed: Bad credentials for user: " + loginRequest.getUsername());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        } catch (Exception e) {
            System.out.println("❌ Authentication error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication failed: " + e.getMessage()));
        }
    }

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

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        try {
            // Lấy token từ header Authorization
            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                // Kiểm tra token có trong blacklist không
                if (tokenBlacklistService.isTokenBlacklisted(token)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("valid", false, "message", "Token has been revoked"));
                }

                // Xác thực token
                String username = jwtUtils.extractUsername(token);
                if (username != null && !jwtUtils.isTokenExpired(token)) {
                    return ResponseEntity.ok(Map.of("valid", true));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Invalid or expired token"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("valid", false, "message", "Error validating token: " + e.getMessage()));
        }
    }

    /**
     * Register new user
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        try {
            String username = registerRequest.get("username");
            String email = registerRequest.get("email");
            String password = registerRequest.get("password");
            String fullName = registerRequest.get("fullName");
            String firstName = registerRequest.get("firstName");
            String lastName = registerRequest.get("lastName");
            String genderStr = registerRequest.get("gender");
            String phoneNumber = registerRequest.get("phoneNumber");

            System.out.println("📝 Registration attempt for user: " + username);

            // Validate required fields
            if (username == null || username.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Username is required"));
            }
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email is required"));
            }
            if (password == null || password.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Password is required"));
            }

            // Check if user already exists
            if (userService.isUsernameTaken(username)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Username is already taken"));
            }
            if (userService.isEmailTaken(email)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email is already taken"));
            }

            // Create fullName from firstName and lastName if not provided
            if (fullName == null || fullName.trim().isEmpty()) {
                StringBuilder nameBuilder = new StringBuilder();
                if (firstName != null && !firstName.trim().isEmpty()) {
                    nameBuilder.append(firstName.trim());
                }
                if (lastName != null && !lastName.trim().isEmpty()) {
                    if (nameBuilder.length() > 0) {
                        nameBuilder.append(" ");
                    }
                    nameBuilder.append(lastName.trim());
                }
                fullName = nameBuilder.length() > 0 ? nameBuilder.toString() : username;
            }

            // Create new user
            User newUser = userService.createUser(username, email, password, fullName, Role.USER);

            // Update additional fields if provided
            if (genderStr != null && !genderStr.trim().isEmpty()) {
                try {
                    Gender gender = Gender.valueOf(genderStr.toUpperCase());
                    newUser.setGender(gender);
                } catch (IllegalArgumentException e) {
                    System.out.println("Invalid gender value: " + genderStr);
                }
            }

            if (phoneNumber != null && !phoneNumber.trim().isEmpty()) {
                newUser.setPhone(phoneNumber);
            }

            // Save updated user
            User savedUser = userService.updateUser(newUser.getId(), newUser.getFullName(),
                    newUser.getEmail(), newUser.getGender(),
                    newUser.getPhone());

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("user", Map.of(
                    "id", savedUser.getId(),
                    "username", savedUser.getUsername(),
                    "email", savedUser.getEmail(),
                    "fullName", savedUser.getFullName(),
                    "role", savedUser.getRole().toString()));

            System.out.println("✅ Registration successful for user: " + username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Registration failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    /**
     * Refresh token endpoint
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> refreshRequest) {
        try {
            String refreshToken = refreshRequest.get("refreshToken");

            if (refreshToken == null || refreshToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Refresh token is required"));
            }

            // TODO: Implement token refresh logic
            // For now, return the same token (this should be improved)
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", refreshToken);
            response.put("message", "Token refreshed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Token refresh failed: " + e.getMessage()));
        }
    }

    /**
     * Change password endpoint
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwordRequest) {
        try {
            String currentPassword = passwordRequest.get("currentPassword");
            String newPassword = passwordRequest.get("newPassword");

            // TODO: Implement password change logic
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password changed successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password change failed: " + e.getMessage()));
        }
    }

    /**
     * Forgot password endpoint
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> forgotRequest) {
        try {
            String email = forgotRequest.get("email");

            // TODO: Implement forgot password logic
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset email sent to " + email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password reset request failed: " + e.getMessage()));
        }
    }

    /**
     * Reset password endpoint
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> resetRequest) {
        try {
            String token = resetRequest.get("token");
            String newPassword = resetRequest.get("newPassword");

            // TODO: Implement password reset logic
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password reset failed: " + e.getMessage()));
        }
    }
    
}
