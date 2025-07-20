package com.leenglish.toeic.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.AdminResponseRequest;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.FeedbackDto;
import com.leenglish.toeic.dto.FeedbackRequest;
import com.leenglish.toeic.service.FeedbackService;
import com.leenglish.toeic.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private UserService userService;

    // User operations
    @PostMapping
    public ResponseEntity<ApiResponse<FeedbackDto>> createFeedback(
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        FeedbackDto feedback = feedbackService.createFeedback(user.getId(), request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(feedback, "Feedback submitted successfully"));
    }

    @PutMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackDto>> updateFeedback(
            @PathVariable Long feedbackId,
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        FeedbackDto feedback = feedbackService.updateFeedback(user.getId(), feedbackId, request);
        
        return ResponseEntity.ok(ApiResponse.success(feedback, "Feedback updated successfully"));
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(
            @PathVariable Long feedbackId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        feedbackService.deleteFeedback(user.getId(), feedbackId);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Feedback deleted successfully"));
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<ApiResponse<FeedbackDto>> getFeedback(
            @PathVariable Long feedbackId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        FeedbackDto feedback = feedbackService.getFeedbackById(feedbackId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.success(feedback, "Feedback retrieved successfully"));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getMyFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackByUser(user.getId(), user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Your feedback retrieved successfully"));
    }

    // Admin operations
    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getAllFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<FeedbackDto> feedbacks = feedbackService.getAllFeedback(admin.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "All feedback retrieved successfully"));
    }

    @GetMapping("/admin/status/{status}")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getFeedbackByStatus(
            @PathVariable String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackByStatus(admin.getId(), status, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Feedback by status retrieved successfully"));
    }

    @GetMapping("/admin/priority/{priority}")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getFeedbackByPriority(
            @PathVariable String priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackByPriority(admin.getId(), priority, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Feedback by priority retrieved successfully"));
    }

    @GetMapping("/admin/type/{feedbackType}")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getFeedbackByType(
            @PathVariable String feedbackType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackByType(admin.getId(), feedbackType, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Feedback by type retrieved successfully"));
    }

    @GetMapping("/admin/pending")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getPendingFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getPendingFeedback(admin.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Pending feedback retrieved successfully"));
    }

    @GetMapping("/admin/urgent")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getUrgentFeedback(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getUrgentFeedback(admin.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Urgent feedback retrieved successfully"));
    }

    @GetMapping("/admin/needing-response")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getFeedbackNeedingResponse(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackNeedingResponse(admin.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Feedback needing response retrieved successfully"));
    }

    @PutMapping("/admin/{feedbackId}/respond")
    public ResponseEntity<ApiResponse<FeedbackDto>> respondToFeedback(
            @PathVariable Long feedbackId,
            @Valid @RequestBody AdminResponseRequest request,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        FeedbackDto feedback = feedbackService.respondToFeedback(admin.getId(), feedbackId, request);
        
        return ResponseEntity.ok(ApiResponse.success(feedback, "Response sent successfully"));
    }

    @PutMapping("/admin/{feedbackId}/status")
    public ResponseEntity<ApiResponse<FeedbackDto>> updateFeedbackStatus(
            @PathVariable Long feedbackId,
            @RequestParam String status,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        FeedbackDto feedback = feedbackService.updateFeedbackStatus(admin.getId(), feedbackId, status);
        
        return ResponseEntity.ok(ApiResponse.success(feedback, "Feedback status updated successfully"));
    }

    @GetMapping("/admin/search")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> searchFeedback(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.searchFeedback(admin.getId(), searchTerm, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Search results retrieved successfully"));
    }

    @GetMapping("/admin/filter")
    public ResponseEntity<ApiResponse<Page<FeedbackDto>>> getFeedbackByCriteria(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String feedbackType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<FeedbackDto> feedbacks = feedbackService.getFeedbackByCriteria(admin.getId(), status, priority, feedbackType, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Filtered feedback retrieved successfully"));
    }

    // Statistics
    @GetMapping("/admin/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFeedbackStatistics(Authentication authentication) {
        User admin = userService.getCurrentUser(authentication);
        Map<String, Object> stats = feedbackService.getFeedbackStatistics(admin.getId());
        
        return ResponseEntity.ok(ApiResponse.success(stats, "Feedback statistics retrieved successfully"));
    }

    @GetMapping("/admin/recent")
    public ResponseEntity<ApiResponse<List<FeedbackDto>>> getRecentFeedback(
            @RequestParam(defaultValue = "5") int limit,
            Authentication authentication) {
        
        User admin = userService.getCurrentUser(authentication);
        List<FeedbackDto> feedbacks = feedbackService.getRecentFeedback(admin.getId(), limit);
        
        return ResponseEntity.ok(ApiResponse.success(feedbacks, "Recent feedback retrieved successfully"));
    }

    @GetMapping("/admin/count/status/{status}")
    public ResponseEntity<ApiResponse<Long>> getFeedbackCountByStatus(@PathVariable String status) {
        Long count = feedbackService.getFeedbackCountByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(count, "Feedback count by status retrieved successfully"));
    }

    @GetMapping("/admin/count/priority/{priority}")
    public ResponseEntity<ApiResponse<Long>> getFeedbackCountByPriority(@PathVariable String priority) {
        Long count = feedbackService.getFeedbackCountByPriority(priority);
        return ResponseEntity.ok(ApiResponse.success(count, "Feedback count by priority retrieved successfully"));
    }

    @GetMapping("/admin/count/type/{feedbackType}")
    public ResponseEntity<ApiResponse<Long>> getFeedbackCountByType(@PathVariable String feedbackType) {
        Long count = feedbackService.getFeedbackCountByType(feedbackType);
        return ResponseEntity.ok(ApiResponse.success(count, "Feedback count by type retrieved successfully"));
    }

    @GetMapping("/admin/count/urgent")
    public ResponseEntity<ApiResponse<Long>> getUrgentFeedbackCount() {
        Long count = feedbackService.getUrgentFeedbackCount();
        return ResponseEntity.ok(ApiResponse.success(count, "Urgent feedback count retrieved successfully"));
    }

    @GetMapping("/admin/count/pending")
    public ResponseEntity<ApiResponse<Long>> getPendingFeedbackCount() {
        Long count = feedbackService.getPendingFeedbackCount();
        return ResponseEntity.ok(ApiResponse.success(count, "Pending feedback count retrieved successfully"));
    }
} 