package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.repository.UserRepository;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

/**
 * ================================================================
 * AUTHENTICATION SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Handles user authentication, JWT token generation/validation,
 * password management, and session control for the TOEIC platform
 * 
 * FEATURES:
 * • JWT token generation and validation
 * • Password encoding and verification
 * • User authentication and authorization
 * • Token refresh mechanism
 * • Session management
 * • Security utilities
 */

@Service
public class AuthenticationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.leenglish.toeic.security.UserDetailsServiceImpl userDetailsService;

    // JWT Configuration
    @Value("${jwt.secret:leenglish-toeic-platform-secret-key-2024}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400}") // 24 hours in seconds
    private int jwtExpirationInSeconds;

    @Value("${jwt.refresh.expiration:604800}") // 7 days in seconds
    private int refreshTokenExpirationInSeconds;

    // ========== AUTHENTICATION METHODS ==========

    /**
     * Authenticate user with username/email and password
     * 
     * @param usernameOrEmail Username or email address
     * @param password        Raw password
     * @return Authenticated user or null if invalid credentials
     */
    public User authenticateUser(String usernameOrEmail, String password) {
        try {
            // Find user by username or email
            Optional<User> userOpt = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail);

            if (userOpt.isEmpty()) {
                // Không tìm thấy user trong DB, trả về null (không cho đăng nhập)
                return null;
            }

            User user = userOpt.get();

            // Verify password
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                return null; // Invalid password
            }

            // Update last login time
            user.setLastLoginDate(LocalDateTime.now());
            userRepository.save(user);

            return user;

        } catch (Exception e) {
            // Log authentication error
            System.err.println("Authentication error for user: " + usernameOrEmail + " - " + e.getMessage());
            return null;
        }
    }

    /**
     * Register new user with encoded password
     * 
     * @param username Unique username
     * @param email    Unique email address
     * @param password Raw password (will be encoded)
     * @param role     User role (default: USER)
     * @return Created user or null if registration failed
     */
    public User registerUser(String username, String email, String password, Role role) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(username).isPresent()) {
                throw new RuntimeException("Username already exists: " + username);
            }

            // Check if email already exists
            if (userRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Email already exists: " + email);
            }

            // Create new user
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPasswordHash(passwordEncoder.encode(password)); // Encode password
            newUser.setRole(role != null ? role : Role.USER); // Default to USER role
            newUser.setCreatedDate(LocalDateTime.now());
            newUser.setLastLoginDate(LocalDateTime.now());

            // Save user
            return userRepository.save(newUser);

        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            return null;
        }
    }

    // ========== JWT TOKEN METHODS ==========

    /**
     * Generate JWT access token for authenticated user
     */
    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("tokenType", "ACCESS");

        return createToken(claims, user.getUsername(), jwtExpirationInSeconds);
    }

    /**
     * Generate JWT refresh token for token renewal
     */
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("tokenType", "REFRESH");

        return createToken(claims, user.getUsername(), refreshTokenExpirationInSeconds);
    }

    /**
     * Create JWT token with custom claims and expiration
     * 
     * @param claims            Token claims/payload
     * @param subject           Token subject (usually username)
     * @param expirationSeconds Expiration time in seconds
     * @return JWT token string
     */
    private String createToken(Map<String, Object> claims, String subject, int expirationSeconds) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationSeconds * 1000L))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Validate JWT token and extract claims
     * 
     * @param token JWT token string
     * @return Token claims or null if invalid
     */
    public Claims validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception e) {
            System.err.println("Token validation error: " + e.getMessage());
            return null;
        }
    }

    /**
     * Extract username from JWT token
     * 
     * @param token JWT token string
     * @return Username or null if invalid token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = validateToken(token);
        return claims != null ? claims.getSubject() : null;
    }

    /**
     * Extract user ID from JWT token
     * 
     * @param token JWT token string
     * @return User ID or null if invalid token
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = validateToken(token);
        if (claims != null && claims.get("userId") != null) {
            return Long.valueOf(claims.get("userId").toString());
        }
        return null;
    }

    /**
     * Extract user role from JWT token
     * 
     * @param token JWT token string
     * @return User role or null if invalid token
     */
    public Role getRoleFromToken(String token) {
        Claims claims = validateToken(token);
        if (claims != null && claims.get("role") != null) {
            try {
                return Role.valueOf(claims.get("role").toString());
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Check if JWT token is expired
     * 
     * @param token JWT token string
     * @return true if token is expired
     */
    public boolean isTokenExpired(String token) {
        Claims claims = validateToken(token);
        if (claims == null) {
            return true; // Invalid token is considered expired
        }
        return claims.getExpiration().before(new Date());
    }

    /**
     * Refresh JWT access token using refresh token
     * 
     * @param refreshToken Valid refresh token
     * @return New access token or null if refresh failed
     */
    public String refreshAccessToken(String refreshToken) {
        try {
            Claims claims = validateToken(refreshToken);
            if (claims == null || !"REFRESH".equals(claims.get("tokenType"))) {
                return null; // Invalid refresh token
            }

            String username = claims.getSubject();
            Optional<User> userOpt = userRepository.findByUsername(username);

            if (userOpt.isEmpty()) {
                return null; // User not found
            }

            // Generate new access token
            return generateAccessToken(userOpt.get());

        } catch (Exception e) {
            System.err.println("Token refresh error: " + e.getMessage());
            return null;
        }
    }

    // ========== PASSWORD MANAGEMENT ==========

    /**
     * Encode raw password using configured password encoder
     * 
     * @param rawPassword Raw password string
     * @return Encoded password
     */
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * Verify raw password against encoded password
     * 
     * @param rawPassword     Raw password from user input
     * @param encodedPassword Stored encoded password
     * @return true if passwords match
     */
    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    /**
     * Change user password with verification
     * 
     * @param userId          User ID
     * @param currentPassword Current password for verification
     * @param newPassword     New password to set
     * @return true if password was changed successfully
     */
    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return false; // User not found
            }

            User user = userOpt.get();

            // Verify current password
            if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
                return false; // Current password is incorrect
            }

            // Set new password
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            
            // Clear user cache to ensure fresh data is loaded on next authentication
            userDetailsService.evictUserFromCache(user.getUsername());

            return true;

        } catch (Exception e) {
            System.err.println("Password change error: " + e.getMessage());
            return false;
        }
    }

    // ========== UTILITY METHODS ==========

    /**
     * Get user by JWT token
     * 
     * @param token JWT token string
     * @return User object or null if token is invalid
     */
    public User getUserFromToken(String token) {
        String username = getUsernameFromToken(token);
        if (username != null) {
            return userRepository.findByUsername(username).orElse(null);
        }
        return null;
    }

    /**
     * Check if user has specific role
     * 
     * @param token        JWT token string
     * @param requiredRole Required role to check
     * @return true if user has the required role
     */
    public boolean hasRole(String token, Role requiredRole) {
        Role userRole = getRoleFromToken(token);
        return userRole != null && userRole == requiredRole;
    }

    /**
     * Check if user is admin
     * 
     * @param token JWT token string
     * @return true if user is admin
     */
    public boolean isAdmin(String token) {
        return hasRole(token, Role.ADMIN);
    }

    /**
     * Check if user can access resource (admin or resource owner)
     * 
     * @param token          JWT token string
     * @param resourceUserId ID of the resource owner
     * @return true if user can access the resource
     */
    public boolean canAccessResource(String token, Long resourceUserId) {
        Long tokenUserId = getUserIdFromToken(token);
        return isAdmin(token) || (tokenUserId != null && tokenUserId.equals(resourceUserId));
    }

    /**
     * Generate authentication response with tokens
     * 
     * @param user Authenticated user
     * @return Map containing access token, refresh token, and user info
     */
    public Map<String, Object> generateAuthResponse(User user) {
        Map<String, Object> response = new HashMap<>();

        // Generate tokens
        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);

        // User info (without sensitive data)
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("role", user.getRole().name());
        userInfo.put("fullName", user.getFullName());

        // Response data
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("tokenType", "Bearer");
        response.put("expiresIn", jwtExpirationInSeconds);
        response.put("user", userInfo);

        return response;
    }
}
