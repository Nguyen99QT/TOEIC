package com.leenglish.toeic.controller;

import java.util.List;

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
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.CommentReplyDto;
import com.leenglish.toeic.dto.LessonCommentDto;
import com.leenglish.toeic.dto.LessonCommentRequest;
import com.leenglish.toeic.service.LessonCommentService;
import com.leenglish.toeic.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comments")
public class LessonCommentController {

    @Autowired
    private LessonCommentService lessonCommentService;

    @Autowired
    private UserService userService;

    // Comment operations
    @PostMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<LessonCommentDto>> createComment(
            @PathVariable Long lessonId,
            @Valid @RequestBody LessonCommentRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        LessonCommentDto comment = lessonCommentService.createComment(user.getId(), lessonId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.successWithData(comment, "Comment created successfully"));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<ApiResponse<LessonCommentDto>> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody LessonCommentRequest request,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        LessonCommentDto comment = lessonCommentService.updateComment(user.getId(), commentId, request);
        
        return ResponseEntity.ok(ApiResponse.successWithData(comment, "Comment updated successfully"));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.deleteComment(user.getId(), commentId);
        
        return ResponseEntity.ok(ApiResponse.successMessage("Comment deleted successfully"));
    }

    @GetMapping("/{commentId}")
    public ResponseEntity<ApiResponse<LessonCommentDto>> getComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        LessonCommentDto comment = lessonCommentService.getCommentById(commentId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.successWithData(comment, "Comment retrieved successfully"));
    }

    @GetMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<Page<LessonCommentDto>>> getCommentsByLesson(
            @PathVariable Long lessonId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<LessonCommentDto> comments = lessonCommentService.getCommentsByLesson(lessonId, user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(comments, "Comments retrieved successfully"));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Page<LessonCommentDto>>> getCommentsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User currentUser = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<LessonCommentDto> comments = lessonCommentService.getCommentsByUser(userId, currentUser.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(comments, "User comments retrieved successfully"));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<Page<LessonCommentDto>>> getRecentComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<LessonCommentDto> comments = lessonCommentService.getRecentComments(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(comments, "Recent comments retrieved successfully"));
    }

    @GetMapping("/popular")
    public ResponseEntity<ApiResponse<Page<LessonCommentDto>>> getPopularComments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "likeCount"));
        
        Page<LessonCommentDto> comments = lessonCommentService.getPopularComments(user.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(comments, "Popular comments retrieved successfully"));
    }

    @GetMapping("/lessons/{lessonId}/count")
    public ResponseEntity<ApiResponse<Long>> getCommentCountByLesson(@PathVariable Long lessonId) {
        Long count = lessonCommentService.getCommentCountByLesson(lessonId);
        return ResponseEntity.ok(ApiResponse.successWithData(count, "Comment count retrieved successfully"));
    }

    // Reply operations
    @PostMapping("/{commentId}/replies")
    public ResponseEntity<ApiResponse<CommentReplyDto>> createReply(
            @PathVariable Long commentId,
            @RequestBody String content,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        CommentReplyDto reply = lessonCommentService.createReply(user.getId(), commentId, content);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.successWithData(reply, "Reply created successfully"));
    }

    @PutMapping("/replies/{replyId}")
    public ResponseEntity<ApiResponse<CommentReplyDto>> updateReply(
            @PathVariable Long replyId,
            @RequestBody String content,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        CommentReplyDto reply = lessonCommentService.updateReply(user.getId(), replyId, content);
        
        return ResponseEntity.ok(ApiResponse.successWithData(reply, "Reply updated successfully"));
    }

    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<ApiResponse<Void>> deleteReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.deleteReply(user.getId(), replyId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Reply deleted successfully"));
    }

    @GetMapping("/replies/{replyId}")
    public ResponseEntity<ApiResponse<CommentReplyDto>> getReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        CommentReplyDto reply = lessonCommentService.getReplyById(replyId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.successWithData(reply, "Reply retrieved successfully"));
    }

    @GetMapping("/{commentId}/replies")
    public ResponseEntity<ApiResponse<List<CommentReplyDto>>> getRepliesByComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        List<CommentReplyDto> replies = lessonCommentService.getRepliesByComment(commentId, user.getId());
        
        return ResponseEntity.ok(ApiResponse.successWithData(replies, "Replies retrieved successfully"));
    }

    @GetMapping("/users/{userId}/replies")
    public ResponseEntity<ApiResponse<Page<CommentReplyDto>>> getRepliesByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        User currentUser = userService.getCurrentUser(authentication);
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<CommentReplyDto> replies = lessonCommentService.getRepliesByUser(userId, currentUser.getId(), pageable);
        
        return ResponseEntity.ok(ApiResponse.successWithData(replies, "User replies retrieved successfully"));
    }

    // Like operations
    @PostMapping("/{commentId}/like")
    public ResponseEntity<ApiResponse<Void>> likeComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.likeComment(user.getId(), commentId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Comment liked successfully"));
    }

    @PostMapping("/{commentId}/dislike")
    public ResponseEntity<ApiResponse<Void>> dislikeComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.dislikeComment(user.getId(), commentId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Comment disliked successfully"));
    }

    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<ApiResponse<Void>> unlikeComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.unlikeComment(user.getId(), commentId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Comment unliked successfully"));
    }

    @DeleteMapping("/{commentId}/dislike")
    public ResponseEntity<ApiResponse<Void>> undislikeComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.undislikeComment(user.getId(), commentId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Comment undisliked successfully"));
    }

    @PostMapping("/replies/{replyId}/like")
    public ResponseEntity<ApiResponse<Void>> likeReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.likeReply(user.getId(), replyId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Reply liked successfully"));
    }

    @PostMapping("/replies/{replyId}/dislike")
    public ResponseEntity<ApiResponse<Void>> dislikeReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.dislikeReply(user.getId(), replyId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Reply disliked successfully"));
    }

    @DeleteMapping("/replies/{replyId}/like")
    public ResponseEntity<ApiResponse<Void>> unlikeReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.unlikeReply(user.getId(), replyId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Reply unliked successfully"));
    }

    @DeleteMapping("/replies/{replyId}/dislike")
    public ResponseEntity<ApiResponse<Void>> undislikeReply(
            @PathVariable Long replyId,
            Authentication authentication) {
        
        User user = userService.getCurrentUser(authentication);
        lessonCommentService.undislikeReply(user.getId(), replyId);
        
        return ResponseEntity.ok(ApiResponse.successWithData(null, "Reply undisliked successfully"));
    }
} 