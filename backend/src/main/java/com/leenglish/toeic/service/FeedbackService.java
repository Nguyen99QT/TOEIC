package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.leenglish.toeic.domain.Feedback;
import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.FeedbackDto;
import com.leenglish.toeic.dto.FeedbackRequest;

public interface FeedbackService {

    // User operations
    FeedbackDto createFeedback(Long userId, FeedbackRequest request);
    FeedbackDto updateFeedback(Long userId, Long feedbackId, FeedbackRequest request);
    void deleteFeedback(Long userId, Long feedbackId);
    FeedbackDto getFeedbackById(Long feedbackId, Long currentUserId);
    Page<FeedbackDto> getFeedbackByUser(Long userId, Long currentUserId, Pageable pageable);

    // Admin operations
    Page<FeedbackDto> getAllFeedback(Long adminId, Pageable pageable);
    Page<FeedbackDto> getFeedbackByStatus(Long adminId, String status, Pageable pageable);
    Page<FeedbackDto> getFeedbackByPriority(Long adminId, String priority, Pageable pageable);
    Page<FeedbackDto> getFeedbackByType(Long adminId, String feedbackType, Pageable pageable);
    Page<FeedbackDto> getPendingFeedback(Long adminId, Pageable pageable);
    Page<FeedbackDto> getUrgentFeedback(Long adminId, Pageable pageable);
    Page<FeedbackDto> getFeedbackNeedingResponse(Long adminId, Pageable pageable);
    FeedbackDto respondToFeedback(Long adminId, Long feedbackId, AdminResponseRequest request);
    FeedbackDto updateFeedbackStatus(Long adminId, Long feedbackId, String status);
    Page<FeedbackDto> searchFeedback(Long adminId, String searchTerm, Pageable pageable);
    Page<FeedbackDto> getFeedbackByCriteria(Long adminId, String status, String priority, String feedbackType, Pageable pageable);

    // Statistics
    Map<String, Object> getFeedbackStatistics(Long adminId);
    Long getFeedbackCountByStatus(String status);
    Long getFeedbackCountByPriority(String priority);
    Long getFeedbackCountByType(String feedbackType);
    Long getUrgentFeedbackCount();
    Long getPendingFeedbackCount();
    List<FeedbackDto> getRecentFeedback(Long adminId, int limit);

    // Utility methods
    boolean canUserEditFeedback(Long userId, Long feedbackId);
    boolean canUserDeleteFeedback(Long userId, Long feedbackId);
    boolean canAdminRespondToFeedback(Long feedbackId);
    boolean isFeedbackUrgent(Long feedbackId);
    boolean isFeedbackPending(Long feedbackId);
} 