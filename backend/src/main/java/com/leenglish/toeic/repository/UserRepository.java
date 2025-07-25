package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // ========== AUTHENTICATION & SECURITY ==========

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = :username OR u.email = :email")
    Optional<User> findByUsernameOrEmail(@Param("username") String username, @Param("email") String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    // ========== USER MANAGEMENT ==========

    List<User> findByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    // ========== ACTIVE STATUS QUERIES ==========

    List<User> findByRoleAndIsActive(Role role, boolean active);

    @Query("SELECT u FROM User u WHERE u.isActive = true")
    List<User> findActiveUsers();

    @Query("SELECT u FROM User u WHERE u.isActive = true")
    Page<User> findActiveUsers(Pageable pageable);

    // ========== STATISTICS ==========

    @Query("SELECT COUNT(u) FROM User u WHERE u.isActive = true")
    long countActiveUsers();

    long countByRole(Role role);

    // ========== SEARCH ==========

    @Query("SELECT u FROM User u WHERE " +
            "u.username LIKE %:keyword% OR " +
            "u.email LIKE %:keyword% OR " +
            "u.fullName LIKE %:keyword%")
    Page<User> findByKeyword(@Param("keyword") String keyword, Pageable pageable);

    Page<User> findByIsActiveTrue(Pageable pageable);

    // ========== MEMBERSHIP MANAGEMENT ==========

    /**
     * Find users with expired premium memberships
     */
    @Query("SELECT u FROM User u WHERE u.membershipType = 'PREMIUM' AND u.premiumExpiresAt IS NOT NULL AND u.premiumExpiresAt < :now")
    List<User> findExpiredPremiumUsers(@Param("now") LocalDateTime now);

    /**
     * Find premium users whose membership expires between two dates
     */
    @Query("SELECT u FROM User u WHERE u.membershipType = 'PREMIUM' AND u.premiumExpiresAt IS NOT NULL AND u.premiumExpiresAt BETWEEN :start AND :end")
    List<User> findPremiumUsersExpiringBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}
