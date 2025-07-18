package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.UserDto;
import com.leenglish.toeic.enums.Gender;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;

/**
 * ================================================================
 * USER SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Handles all user-related business logic for the TOEIC platform
 * Manages user CRUD operations, profile management, and user-related features
 */

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailVerificationService emailVerificationService;

    // ========== USER RETRIEVAL METHODS ==========

    /**
     * Find user by ID
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find user by username
     */
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Get all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get users by role
     */
    public List<User> getUsersByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(user -> role.equals(user.getRole()))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get active users only
     */
    public List<User> getActiveUsers() {
        return userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .collect(java.util.stream.Collectors.toList());
    }

    // ========== USER MANAGEMENT METHODS ==========

    /**
     * Create new user
     */
    public User createUser(String username, String email, String password,
            String fullName, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role != null ? role : Role.USER);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setIsActive(true); // Đảm bảo user luôn active khi tạo mới
        user.setIsEmailVerified(false); // Email chưa được xác thực
        return userRepository.save(user);
    }

    /**
     * Create new user with email verification
     */
    public User createUserWithEmailVerification(String username, String email, String password,
            String fullName, Role role) {
        User user = createUser(username, email, password, fullName, role);
        
        // Create and send verification email
        emailVerificationService.createVerificationToken(user);
        
        return user;
    }

    /**
     * Update user profile
     */
    public User updateUser(Long userId, String fullName,
            String email, Gender gender, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        if (fullName != null)
            user.setFullName(fullName);
        if (email != null)
            user.setEmail(email);
        if (gender != null)
            user.setGender(gender);
        if (phone != null)
            user.setPhone(phone);

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Update user role (Admin only)
     */
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setRole(newRole);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Change user password
     */
    public void changePassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    /**
     * Soft delete user
     */
    public void softDeleteById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Restore soft deleted user
     */
    public void restoreUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    // ========== USER VALIDATION METHODS ==========

    /**
     * Check if email is already taken
     */
    public boolean isEmailTaken(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Check if username is already taken
     */
    public boolean isUsernameTaken(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    /**
     * Check if user exists and is not deleted
     */
    public boolean userExistsAndActive(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() && user.get().getIsActive();
    }

    /**
     * Check if username exists
     */
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    /**
     * Check if email exists
     */
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // ========== USER STATISTICS METHODS ==========

    /**
     * Count total users
     */
    public long getTotalUserCount() {
        return userRepository.count();
    }

    /**
     * Count active users
     */
    public long getActiveUserCount() {
        return userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .count();
    }

    /**
     * Count users by role
     */
    public long getUserCountByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(user -> role.equals(user.getRole()))
                .count();
    }

    // ========== USER SEARCH METHODS ==========

    /**
     * Search users by name or email
     */
    public List<User> searchUsers(String searchTerm) {
        return userRepository.findAll().stream()
                .filter(user -> (user.getFullName() != null
                        && user.getFullName().toLowerCase().contains(searchTerm.toLowerCase())) ||
                        (user.getEmail() != null && user.getEmail().toLowerCase().contains(searchTerm.toLowerCase())))
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Get recently registered users
     */
    public List<User> getRecentUsers(int limit) {
        return userRepository.findAll().stream()
                .sorted((u1, u2) -> u2.getCreatedAt().compareTo(u1.getCreatedAt()))
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }// ========== COMPATIBILITY METHODS FOR CONTROLLERS ==========

    /**
     * Find user by username (for compatibility)
     */
    public Optional<User> findUserByUsername(String username) {
        return findByUsername(username);
    }

    /**
     * Find user by email (for compatibility)
     */
    public Optional<User> findUserByEmail(String email) {
        return findByEmail(email);
    }

    /**
     * Get user by username (for compatibility) - returns UserDto for security
     * filter
     */
    public Optional<UserDto> getUserByUsername(String username) {
        return findByUsername(username).map(this::convertToDto);
    }

    /**
     * Convert User entity to UserDto
     */
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole());
        dto.setTotalScore(user.getTotalScore());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    /**
     * Find users by role (for compatibility)
     */
    public List<User> findByRole(Role role) {
        return getUsersByRole(role);
    }

    /**
     * Save user (for compatibility)
     */
    public User save(User user) {
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    /**
     * Find top users by score
     */
    public List<User> findTopUsersByScore(int limit) {
        return userRepository.findAll().stream()
                .sorted((u1, u2) -> Integer.compare(u2.getTotalScore() != null ? u2.getTotalScore() : 0,
                        u1.getTotalScore() != null ? u1.getTotalScore() : 0))
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Find users with filters (delegating to repository)
     */
    public Page<User> findUsersWithFilters(String username, String email, Role role,
            Gender gender, String country, Boolean active,
            Pageable pageable) {
        // Fallback implementation - return empty page for now
        return Page.empty(pageable);
    }

    /**
     * Activate user
     */
    public User activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Deactivate user
     */
    public User deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    /**
     * Soft delete user (returns boolean for compatibility)
     */
    public boolean softDeleteUser(Long userId) {
        try {
            softDeleteById(userId);
            return true;
        } catch (EntityNotFoundException e) {
            return false;
        }
    }

    /**
     * Get active users with pagination
     */
    public Page<User> findActiveUsers(Pageable pageable) {
        return userRepository.findByIsActiveTrue(pageable);
    }

    /**
     * Count active users - already exists but rename for clarity
     */
    public long countActiveUsers() {
        return userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .count();
    }

    /**
     * Reset password for user (admin function)
     */
    public void resetPassword(String username, String newPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }
}
