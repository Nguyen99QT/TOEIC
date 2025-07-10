package com.leenglish.toeic.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserStats;

@Repository
public interface UserStatsRepository extends JpaRepository<UserStats, Long> {

        // ================================================================
        // CORE METHODS - CHỈ GIỮ LẠI CÁC METHODS CẦN THIẾT NHẤT
        // ================================================================

        /**
         * Tìm UserStats theo userId (method chính cho dashboard)
         */
        Optional<UserStats> findByUserId(Long userId);

        /**
         * Tìm UserStats active theo userId
         */
        Optional<UserStats> findByUserIdAndIsActiveTrue(Long userId);
}
