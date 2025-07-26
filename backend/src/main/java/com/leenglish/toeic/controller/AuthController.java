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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.leenglish.toeic.dto.JwtResponse;
import com.leenglish.toeic.dto.LoginRequest;
import com.leenglish.toeic.dto.RegistrationResponse;
import com.leenglish.toeic.service.EmailVerificationService;
import com.leenglish.toeic.security.UserDetailsImpl;
import com.leenglish.toeic.service.JwtService;
import com.leenglish.toeic.service.TokenBlacklistService;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.utils.JwtUtils;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.enums.Gender;
import com.leenglish.toeic.enums.MembershipType;
import com.leenglish.toeic.service.EmailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private EmailService emailService;
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

            // Lấy thông tin người dùng
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Kiểm tra email verification
            Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (!user.getIsEmailVerified()) {
                    System.out.println("❌ Login failed: Email not verified for user: " + loginRequest.getUsername());
                    return ResponseEntity
                            .status(HttpStatus.FORBIDDEN)
                            .body(Map.of(
                                    "error", "Email not verified",
                                    "message",
                                    "Please verify your email before logging in. Check your inbox or request a new verification email.",
                                    "email", user.getEmail(),
                                    "needsVerification", true));
                }
            }

            // Thiết lập Security Context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Tạo JWT token
            String jwt = jwtUtils.generateToken(authentication);

            // Lấy danh sách các quyền (roles)
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Lấy membershipType từ user đã có - temporary fix for compilation
            MembershipType membershipType = userOpt.map(User::getMembershipType).orElse(null);
            if (membershipType == null) {
                membershipType = MembershipType.BASIC; // Using BASIC as default
            }

            // Tạo và trả về response với JwtResponse
            System.out.println("✅ Login successful for user: " + loginRequest.getUsername() + " with membership: "
                    + membershipType);

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    roles,
                    membershipType));
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
            String roleStr = registerRequest.get("role"); // Accept role parameter

            System.out.println("📝 Registration attempt for user: " + username + " with role: " + roleStr);

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

            // Parse role from request, default to USER
            Role userRole = Role.USER;
            if (roleStr != null && !roleStr.trim().isEmpty()) {
                try {
                    userRole = Role.valueOf(roleStr.toUpperCase());
                    System.out.println("✅ Setting user role to: " + userRole);
                } catch (IllegalArgumentException e) {
                    System.out.println("⚠️ Invalid role: " + roleStr + ", defaulting to USER");
                    userRole = Role.USER;
                }
            }

            // Create new user with email verification and specified role
            User newUser = userService.createUserWithEmailVerification(username, email, password, fullName, userRole);

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

            // Return success response using DTO
            RegistrationResponse.UserInfo userInfo = new RegistrationResponse.UserInfo(
                    savedUser.getId(),
                    savedUser.getUsername(),
                    savedUser.getEmail(),
                    savedUser.getFullName(),
                    savedUser.getRole().toString(),
                    savedUser.getIsEmailVerified());

            RegistrationResponse response = new RegistrationResponse(
                    "Registration successful! Please check your email to verify your account.",
                    userInfo,
                    true);

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

            // Check if token is blacklisted
            if (tokenBlacklistService.isTokenBlacklisted(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token has been revoked"));
            }

            // Validate refresh token using JwtService
            if (!jwtService.isTokenValid(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired refresh token"));
            }

            // Check if this is actually a refresh token
            if (!jwtService.isRefreshToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Token is not a refresh token"));
            }

            // Extract username from refresh token
            String username = jwtService.extractUsername(refreshToken);
            if (username == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Cannot extract username from token"));
            }

            // Get user details
            Optional<User> userOptional = userService.findByUsername(username);
            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "User not found"));
            }
            User user = userOptional.get();

            // Generate new access token using JwtService
            String newAccessToken = jwtService.generateAccessToken(user);

            // Generate new refresh token using JwtService
            String newRefreshToken = jwtService.generateRefreshToken(user);

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            response.put("tokenType", "Bearer");
            response.put("expiresIn", jwtService.getAccessTokenExpiration());
            response.put("message", "Token refreshed successfully");

            // Add user info
            response.put("user", Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "fullName", user.getFullName(),
                    "role", user.getRole().toString()));

            System.out.println("✅ Token refreshed successfully for user: " + username);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Token refresh failed: " + e.getMessage());
            e.printStackTrace();
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
            // String currentPassword = passwordRequest.get("currentPassword");
            // String newPassword = passwordRequest.get("newPassword");

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
     * Reset password endpoint
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> resetRequest) {
        try {
            String token = resetRequest.get("token");
            String newPassword = resetRequest.get("newPassword");

            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Token is required"));
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "New password is required"));
            }

            // Verify password reset token
            Optional<User> userOpt = emailVerificationService.verifyPasswordResetToken(token);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Invalid or expired token"));
            }

            User user = userOpt.get();

            // Update password
            userService.changePassword(user.getId(), newPassword);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password reset failed: " + e.getMessage()));
        }
    }

    /**
     * Verify email endpoint
     */
    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token, HttpServletResponse response) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Token is required"));
            }

            boolean isVerified = emailVerificationService.verifyEmailToken(token);

            if (isVerified) {
                // Redirect to frontend with success message
                String redirectUrl = "http://localhost:3000/verify-email?status=success&message=Email verified successfully! You can now log in to your account.";
                response.sendRedirect(redirectUrl);
                return null; // Response already sent
            } else {
                // Redirect to frontend with error message
                String redirectUrl = "http://localhost:3000/verify-email?status=error&message=Invalid or expired verification token.";
                response.sendRedirect(redirectUrl);
                return null; // Response already sent
            }

        } catch (Exception e) {
            try {
                // Redirect to frontend with error message
                String redirectUrl = "http://localhost:3000/verify-email?status=error&message=Email verification failed: "
                        + e.getMessage();
                response.sendRedirect(redirectUrl);
                return null; // Response already sent
            } catch (Exception redirectException) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("message", "Email verification failed: " + e.getMessage()));
            }
        }
    }

    /**
     * Resend verification email endpoint
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email is required"));
            }

            boolean isSent = emailVerificationService.resendVerificationEmail(email);

            if (isSent) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Verification email sent successfully. Please check your inbox.");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Failed to send verification email. Please check your email address."));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to resend verification email: " + e.getMessage()));
        }
    }

    /**
     * Forgot password endpoint - updated to use email verification
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> forgotRequest) {
        try {
            String email = forgotRequest.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Email is required"));
            }

            // Find user by email
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "No account found with this email address"));
            }

            User user = userOpt.get();

            // Create and send password reset token
            emailVerificationService.createPasswordResetToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Password reset email sent to " + email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Password reset request failed: " + e.getMessage()));
        }
    }

    /**
     * Test email sending functionality
     */
    @PostMapping("/test-email")
    public ResponseEntity<?> testEmail(@RequestBody Map<String, String> request) {
        try {
            String testEmail = request.get("email");
            if (testEmail == null || testEmail.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }

            // Create a test user
            User testUser = new User();
            testUser.setEmail(testEmail);
            testUser.setUsername("testuser");
            testUser.setFullName("Test User");

            // Send test email
            emailService.sendVerificationEmail(testUser, "test-token-123");

            return ResponseEntity.ok(Map.of(
                    "message", "Test email sent successfully",
                    "email", testEmail));
        } catch (Exception e) {
            System.err.println("❌ Test email failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to send test email: " + e.getMessage()));
        }
    }

    /**
     * Get current user information
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            System.out.println("=== /api/auth/me Debug Info ===");
            System.out.println("Authentication parameter: " + authentication);
            
            // Thử lấy từ SecurityContextHolder
            Authentication contextAuth = SecurityContextHolder.getContext().getAuthentication();
            System.out.println("SecurityContext Authentication: " + contextAuth);
            
            if (contextAuth != null) {
                System.out.println("SecurityContext Principal: " + contextAuth.getPrincipal());
                System.out.println("SecurityContext Authorities: " + contextAuth.getAuthorities());
            }
            
            // Sử dụng authentication từ SecurityContext nếu parameter null
            Authentication finalAuth = authentication != null ? authentication : contextAuth;
            
            if (finalAuth == null) {
                System.out.println("Both authentication sources are null - returning 401");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Not authenticated"));
            }

            UserDetailsImpl userDetails = (UserDetailsImpl) finalAuth.getPrincipal();
            Map<String, Object> response = new HashMap<>();
            response.put("id", userDetails.getId());
            response.put("username", userDetails.getUsername());
            response.put("email", userDetails.getEmail());
            response.put("roles", userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList()));
            response.put("isActive", userDetails.isEnabled());

            System.out.println("Successfully returning user info for: " + userDetails.getUsername());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Error in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to get current user: " + e.getMessage()));
        }
    }
}
