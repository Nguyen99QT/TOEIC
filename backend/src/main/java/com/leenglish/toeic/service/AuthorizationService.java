package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import com.leenglish.toeic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * ================================================================
 * AUTHORIZATION SERVICE - LEENGLISH TOEIC PLATFORM
 * ================================================================
 * 
 * Handles Role-Based Access Control (RBAC) for the TOEIC platform
 * Manages permissions, resource access, and security policies
 */

@Service
public class AuthorizationService {

    @Autowired
    private UserRepository userRepository;

    // ========== USER MANAGEMENT AUTHORIZATION ==========

    /**
     * Check if current user can view target user's profile
     */
    public boolean canViewUser(User currentUser, Long targetUserId) {
        if (currentUser == null || targetUserId == null) {
            return false;
        }

        // Admins can view anyone
        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        // Users can only view their own profile
        return currentUser.getId().equals(targetUserId);
    }

    /**
     * Check if current user can edit target user's profile
     */
    public boolean canEditUser(User currentUser, Long targetUserId) {
        if (currentUser == null || targetUserId == null) {
            return false;
        }

        // Admins can edit anyone
        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        // Users can only edit their own profile
        return currentUser.getId().equals(targetUserId);
    }

    /**
     * Check if current user can delete target user
     */
    public boolean canDeleteUser(User currentUser, Long targetUserId) {
        if (currentUser == null || targetUserId == null) {
            return false;
        }

        // Only admins can delete users
        if (currentUser.getRole() != Role.ADMIN) {
            return false;
        }

        // Admins cannot delete themselves (prevent system lockout)
        if (currentUser.getId().equals(targetUserId)) {
            return false;
        }

        return true;
    }

    /**
     * Check if current user can change target user's role
     */
    public boolean canChangeUserRole(User currentUser, Long targetUserId, Role newRole) {
        if (currentUser == null || targetUserId == null || newRole == null) {
            return false;
        }

        // Only admins can change roles
        if (currentUser.getRole() != Role.ADMIN) {
            return false;
        }

        // Admins cannot demote themselves (prevent system lockout)
        if (currentUser.getId().equals(targetUserId) && newRole != Role.ADMIN) {
            return false;
        }

        return true;
    }

    /**
     * Check if current user can view all users (admin function)
     */
    public boolean canViewAllUsers(User currentUser) {
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }

    /**
     * Check if current user can access admin panel
     */
    public boolean canAccessAdminPanel(User currentUser) {
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }

    /**
     * Check if current user can create content (lessons/exercises)
     */
    public boolean canCreateContent(User currentUser) {
        if (currentUser == null) {
            return false;
        }

        return currentUser.getRole() == Role.ADMIN ||
                currentUser.getRole() == Role.COLLABORATOR;
    }

    /**
     * Check if current user can edit content
     */
    public boolean canEditContent(User currentUser, Long contentCreatorId) {
        if (currentUser == null || contentCreatorId == null) {
            return false;
        }

        // Admins can edit any content
        if (currentUser.getRole() == Role.ADMIN) {
            return true;
        }

        // Collaborators can edit their own content
        if (currentUser.getRole() == Role.COLLABORATOR) {
            return currentUser.getId().equals(contentCreatorId);
        }

        return false;
    }

    /**
     * Check if user exists and is valid
     */
    public boolean isValidUser(Long userId) {
        if (userId == null) {
            return false;
        }
        Optional<User> userOpt = userRepository.findById(userId);
        return userOpt.isPresent();
    }

    /**
     * Get user by ID with existence check
     */
    public User getUserById(Long userId) {
        if (userId == null) {
            return null;
        }
        return userRepository.findById(userId).orElse(null);
    }

    /**
     * Check if user has specific role
     */
    public boolean hasRole(User user, Role requiredRole) {
        return user != null && user.getRole() == requiredRole;
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(User user) {
        return hasRole(user, Role.ADMIN);
    }

    /**
     * Check if user is collaborator or higher
     */
    public boolean isCollaboratorOrAbove(User user) {
        if (user == null) {
            return false;
        }
        return user.getRole() == Role.ADMIN || user.getRole() == Role.COLLABORATOR;
    }

    /**
     * Get unauthorized message for API responses
     */
    public String getUnauthorizedMessage(String action, Role requiredRole) {
        return String.format("Access denied. %s requires %s role or higher.", 
                           action, requiredRole.name());
    }

    /**
     * Check if current user can perform bulk operations
     */
    public boolean canPerformBulkOperations(User currentUser) {
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }

    /**
     * Check if current user can export data
     */
    public boolean canExportData(User currentUser) {
        return currentUser != null && 
               (currentUser.getRole() == Role.ADMIN || currentUser.getRole() == Role.COLLABORATOR);
    }

    /**
     * Check if current user can view system statistics
     */
    public boolean canViewSystemStats(User currentUser) {
        return currentUser != null && currentUser.getRole() == Role.ADMIN;
    }
}
