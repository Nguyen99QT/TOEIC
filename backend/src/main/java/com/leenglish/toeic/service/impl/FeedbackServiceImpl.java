package com.leenglish.toeic.service.impl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Feedback;
import com.leenglish.toeic.domain.Feedback.FeedbackType;
import com.leenglish.toeic.domain.Feedback.Priority;
import com.leenglish.toeic.domain.Feedback.Status;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.FeedbackDto;
import com.leenglish.toeic.dto.FeedbackRequest;
import com.leenglish.toeic.exception.ResourceNotFoundException;
import com.leenglish.toeic.exception.UnauthorizedException;
import com.leenglish.toeic.repository.FeedbackRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.service.FeedbackService;

@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    // User operations
    @Override
    public FeedbackDto createFeedback(Long userId, FeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Feedback feedback = new Feedback(user, request.getSubject(), request.getContent(), request.getFeedbackType());
        feedback.setPriority(request.getPriority());
        feedback.setIsAnonymous(request.getIsAnonymous());
        feedback.setContactEmail(request.getContactEmail());
        feedback.setContactPhone(request.getContactPhone());

        feedback = feedbackRepository.save(feedback);
        return convertToDto(feedback, userId);
    }

    @Override
    public FeedbackDto updateFeedback(Long userId, Long feedbackId, FeedbackRequest request) {
        Feedback feedback = feedbackRepository.findByIdAndActive(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own feedback");
        }   

        if (!feedback.canBeEdited()) {
            throw new UnauthorizedException("Feedback cannot be edited");
        }

        feedback.setSubject(request.getSubject());
        feedback.setContent(request.getContent());
        feedback.setFeedbackType(request.getFeedbackType());
        feedback.setPriority(request.getPriority());
        feedback.setIsAnonymous(request.getIsAnonymous());
        feedback.setContactEmail(request.getContactEmail());
        feedback.setContactPhone(request.getContactPhone());

        feedback = feedbackRepository.save(feedback);
        return convertToDto(feedback, userId);
    }

    @Override
    public void deleteFeedback(Long userId, Long feedbackId) {
        Feedback feedback = feedbackRepository.findByIdAndActive(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own feedback");
        }

        if (!feedback.canBeDeleted()) {
            throw new UnauthorizedException("Feedback cannot be deleted");
        }

        feedback.setIsDeleted(true);
        feedbackRepository.save(feedback);
    }

    @Override
    public FeedbackDto getFeedbackById(Long feedbackId, Long currentUserId) {
        Feedback feedback = feedbackRepository.findByIdAndActive(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        return convertToDto(feedback, currentUserId);
    }

    @Override
    public Page<FeedbackDto> getFeedbackByUser(Long userId, Long currentUserId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.findByUserIdAndActive(userId, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, currentUserId));
    }

    // Admin operations
    @Override
    public Page<FeedbackDto> getAllFeedback(Long adminId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.findAllActive(pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getFeedbackByStatus(Long adminId, String status, Pageable pageable) {
        Status feedbackStatus = Status.valueOf(status.toUpperCase());
        Page<Feedback> feedbacks = feedbackRepository.findByStatusAndActive(feedbackStatus, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getFeedbackByPriority(Long adminId, String priority, Pageable pageable) {
        Priority feedbackPriority = Priority.valueOf(priority.toUpperCase());
        Page<Feedback> feedbacks = feedbackRepository.findByPriorityAndActive(feedbackPriority, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getFeedbackByType(Long adminId, String feedbackType, Pageable pageable) {
        FeedbackType type = FeedbackType.valueOf(feedbackType.toUpperCase());
        Page<Feedback> feedbacks = feedbackRepository.findByFeedbackTypeAndActive(type, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getPendingFeedback(Long adminId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.findPendingFeedback(pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getUrgentFeedback(Long adminId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.findUrgentFeedback(pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getFeedbackNeedingResponse(Long adminId, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.findFeedbackNeedingResponse(pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public FeedbackDto respondToFeedback(Long adminId, Long feedbackId, AdminResponseRequest request) {
        Feedback feedback = feedbackRepository.findByIdAndActive(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        if (!feedback.canBeResponded()) {
            throw new UnauthorizedException("Feedback cannot be responded to");
        }

        feedback.setAdminResponse(request.getAdminResponse());
        feedback.setStatus(request.getStatus());
        feedback.setRespondedBy(adminId);
        feedback.setRespondedAt(LocalDateTime.now());

        feedback = feedbackRepository.save(feedback);
        return convertToDto(feedback, adminId);
    }

    @Override
    public FeedbackDto updateFeedbackStatus(Long adminId, Long feedbackId, String status) {
        Feedback feedback = feedbackRepository.findByIdAndActive(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found"));

        Status feedbackStatus = Status.valueOf(status.toUpperCase());
        feedback.setStatus(feedbackStatus);

        feedback = feedbackRepository.save(feedback);
        return convertToDto(feedback, adminId);
    }

    @Override
    public Page<FeedbackDto> searchFeedback(Long adminId, String searchTerm, Pageable pageable) {
        Page<Feedback> feedbacks = feedbackRepository.searchFeedback(searchTerm, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    @Override
    public Page<FeedbackDto> getFeedbackByCriteria(Long adminId, String status, String priority, String feedbackType, Pageable pageable) {
        Status feedbackStatus = status != null ? Status.valueOf(status.toUpperCase()) : null;
        Priority feedbackPriority = priority != null ? Priority.valueOf(priority.toUpperCase()) : null;
        FeedbackType type = feedbackType != null ? FeedbackType.valueOf(feedbackType.toUpperCase()) : null;

        Page<Feedback> feedbacks = feedbackRepository.findByCriteria(feedbackStatus, feedbackPriority, type, pageable);
        return feedbacks.map(feedback -> convertToDto(feedback, adminId));
    }

    // Statistics
    @Override
    public Map<String, Object> getFeedbackStatistics(Long adminId) {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("total", feedbackRepository.count());
        stats.put("pending", getPendingFeedbackCount());
        stats.put("urgent", getUrgentFeedbackCount());
        stats.put("resolved", getFeedbackCountByStatus("RESOLVED"));
        stats.put("closed", getFeedbackCountByStatus("CLOSED"));
        
        // Count by priority
        stats.put("lowPriority", getFeedbackCountByPriority("LOW"));
        stats.put("mediumPriority", getFeedbackCountByPriority("MEDIUM"));
        stats.put("highPriority", getFeedbackCountByPriority("HIGH"));
        stats.put("urgentPriority", getFeedbackCountByPriority("URGENT"));
        
        // Count by type
        for (FeedbackType type : FeedbackType.values()) {
            stats.put(type.name().toLowerCase() + "Count", getFeedbackCountByType(type.name()));
        }
        
        return stats;
    }

    @Override
    public Long getFeedbackCountByStatus(String status) {
        Status feedbackStatus = Status.valueOf(status.toUpperCase());
        return feedbackRepository.countByStatusAndActive(feedbackStatus);
    }

    @Override
    public Long getFeedbackCountByPriority(String priority) {
        Priority feedbackPriority = Priority.valueOf(priority.toUpperCase());
        return feedbackRepository.countByPriorityAndActive(feedbackPriority);
    }

    @Override
    public Long getFeedbackCountByType(String feedbackType) {
        FeedbackType type = FeedbackType.valueOf(feedbackType.toUpperCase());
        return feedbackRepository.countByFeedbackTypeAndActive(type);
    }

    @Override
    public Long getUrgentFeedbackCount() {
        return feedbackRepository.countUrgentFeedback();
    }

    @Override
    public Long getPendingFeedbackCount() {
        return feedbackRepository.countPendingFeedback();
    }

    @Override
    public List<FeedbackDto> getRecentFeedback(Long adminId, int limit) {
        List<Feedback> feedbacks = feedbackRepository.findRecentFeedback(limit);
        return feedbacks.stream()
                .map(feedback -> convertToDto(feedback, adminId))
                .collect(Collectors.toList());
    }

    // Utility methods
    @Override
    public boolean canUserEditFeedback(Long userId, Long feedbackId) {
        return feedbackRepository.findByIdAndActive(feedbackId)
                .map(feedback -> feedback.getUser().getId().equals(userId) && feedback.canBeEdited())
                .orElse(false);
    }

    @Override
    public boolean canUserDeleteFeedback(Long userId, Long feedbackId) {
        return feedbackRepository.findByIdAndActive(feedbackId)
                .map(feedback -> feedback.getUser().getId().equals(userId) && feedback.canBeDeleted())
                .orElse(false);
    }

    @Override
    public boolean canAdminRespondToFeedback(Long feedbackId) {
        return feedbackRepository.findByIdAndActive(feedbackId)
                .map(Feedback::canBeResponded)
                .orElse(false);
    }

    @Override
    public boolean isFeedbackUrgent(Long feedbackId) {
        return feedbackRepository.findByIdAndActive(feedbackId)
                .map(Feedback::isUrgent)
                .orElse(false);
    }

    @Override
    public boolean isFeedbackPending(Long feedbackId) {
        return feedbackRepository.findByIdAndActive(feedbackId)
                .map(Feedback::isPending)
                .orElse(false);
    }

    // Helper methods
    private FeedbackDto convertToDto(Feedback feedback, Long currentUserId) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setUserId(feedback.getUser().getId());
        dto.setUserName(feedback.getUser().getUsername());
        dto.setUserAvatar(feedback.getUser().getAvatarUrl());
        dto.setSubject(feedback.getSubject());
        dto.setContent(feedback.getContent());
        dto.setFeedbackType(feedback.getFeedbackType());
        dto.setPriority(feedback.getPriority());
        dto.setStatus(feedback.getStatus());
        dto.setIsAnonymous(feedback.getIsAnonymous());
        dto.setContactEmail(feedback.getContactEmail());
        dto.setContactPhone(feedback.getContactPhone());
        dto.setAdminResponse(feedback.getAdminResponse());
        dto.setRespondedBy(feedback.getRespondedBy());
        dto.setRespondedAt(feedback.getRespondedAt());
        dto.setIsEdited(feedback.getIsEdited());
        dto.setEditedAt(feedback.getEditedAt());
        dto.setIsDeleted(feedback.getIsDeleted());
        dto.setDeletedAt(feedback.getDeletedAt());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        
        // Calculate average rating
        // dto.setAverageRating(feedback.getAverageRating());
        // dto.setIsPositiveFeedback(feedback.isPositiveFeedback());
        // dto.setIsNegativeFeedback(feedback.isNegativeFeedback());
        
        // Set permission flags
        if (currentUserId != null) {
            dto.setCanEdit(canUserEditFeedback(currentUserId, feedback.getId()));
            dto.setCanDelete(canUserDeleteFeedback(currentUserId, feedback.getId()));
            dto.setCanRespond(canAdminRespondToFeedback(feedback.getId()));
        }
        
        return dto;
    }
} 