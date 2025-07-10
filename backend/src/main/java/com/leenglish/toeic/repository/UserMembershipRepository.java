package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.UserMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, Long> {

    Optional<UserMembership> findByUserIdAndIsActiveTrue(Long userId);

    @Query("SELECT um FROM UserMembership um WHERE um.user.id = :userId AND um.endDate > :currentDate AND um.isActive = true")
    Optional<UserMembership> findActiveUserMembership(@Param("userId") Long userId,
            @Param("currentDate") LocalDateTime currentDate);

    List<UserMembership> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT um FROM UserMembership um WHERE um.endDate < :currentDate AND um.isActive = true")
    List<UserMembership> findExpiredMemberships(@Param("currentDate") LocalDateTime currentDate);

    @Query("SELECT um FROM UserMembership um WHERE um.endDate BETWEEN :startDate AND :endDate AND um.isActive = true")
    List<UserMembership> findMembershipsExpiringBetween(@Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);
}
