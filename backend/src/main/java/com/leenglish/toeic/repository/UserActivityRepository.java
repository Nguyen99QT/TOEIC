package com.leenglish.toeic.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserActivity;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {

    // ================================================================
    // CORE METHODS - CHỈ GIỮ LẠI CÁC METHODS CẦN THIẾT NHẤT
    // ================================================================

    /**
     * Lấy 10 hoạt động gần nhất của user (method chính cho dashboard)
     */
    List<UserActivity> findTop10ByUserIdAndIsActiveTrueOrderByCreatedAtDesc(Long userId);
}
