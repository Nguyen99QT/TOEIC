/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.UserResult;
import java.util.List;

/**
 *
 * @author caong
 */
@Repository
public interface UserResultRepository extends JpaRepository<UserResult, Long>{
    
    /**
     * Tìm tất cả kết quả test của user, sắp xếp theo thời gian hoàn thành
     */
    @Query("SELECT ur FROM UserResult ur WHERE ur.user.id = :userId ORDER BY ur.finishedAt DESC")
    List<UserResult> findByUserIdOrderByFinishedAtDesc(@Param("userId") Long userId);
    
    /**
     * Query with JOIN FETCH to avoid lazy loading
     */
    @Query("SELECT ur FROM UserResult ur LEFT JOIN FETCH ur.user LEFT JOIN FETCH ur.test WHERE ur.user.id = :userId ORDER BY ur.finishedAt DESC")
    List<UserResult> findByUserIdWithJoin(@Param("userId") Long userId);
    
    /**
     * Alternative method using native query for debugging
     */
    @Query(value = "SELECT * FROM user_result WHERE user_id = :userId ORDER BY finished_at DESC", nativeQuery = true)
    List<UserResult> findByUserIdNative(@Param("userId") Long userId);
    
    /**
     * Debug all results - return raw data to avoid lazy loading
     */
    @Query(value = "SELECT result_id, user_id, test_id FROM user_result", nativeQuery = true)
    List<Object[]> debugAllResultsNative();
    
    /**
     * Tìm kết quả test gần nhất của user
     */
    @Query("SELECT ur FROM UserResult ur WHERE ur.user.id = :userId ORDER BY ur.finishedAt DESC LIMIT 1")
    UserResult findLatestByUserId(@Param("userId") Long userId);
    
    /**
     * Tìm UserResult theo ID với JOIN FETCH để tránh lazy loading
     */
    @Query("SELECT ur FROM UserResult ur LEFT JOIN FETCH ur.user LEFT JOIN FETCH ur.test WHERE ur.resultId = :resultId")
    UserResult findByIdWithJoinFetch(@Param("resultId") Long resultId);
}
