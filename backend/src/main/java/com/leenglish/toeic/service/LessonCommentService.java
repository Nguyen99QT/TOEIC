package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.leenglish.toeic.domain.CommentLike;
import com.leenglish.toeic.domain.CommentReply;
import com.leenglish.toeic.domain.LessonComment;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.CommentReplyDto;
import com.leenglish.toeic.dto.LessonCommentDto;
import com.leenglish.toeic.dto.LessonCommentRequest;

public interface LessonCommentService {

    // Comment operations
    LessonCommentDto createComment(Long userId, Long lessonId, LessonCommentRequest request);
    LessonCommentDto updateComment(Long userId, Long commentId, LessonCommentRequest request);
    void deleteComment(Long userId, Long commentId);
    LessonCommentDto getCommentById(Long commentId, Long currentUserId);
    Page<LessonCommentDto> getCommentsByLesson(Long lessonId, Long currentUserId, Pageable pageable);
    Page<LessonCommentDto> getCommentsByUser(Long userId, Long currentUserId, Pageable pageable);
    Page<LessonCommentDto> getRecentComments(Long currentUserId, Pageable pageable);
    Page<LessonCommentDto> getPopularComments(Long currentUserId, Pageable pageable);
    Long getCommentCountByLesson(Long lessonId);

    // Reply operations
    CommentReplyDto createReply(Long userId, Long commentId, String content);
    CommentReplyDto updateReply(Long userId, Long replyId, String content);
    void deleteReply(Long userId, Long replyId);
    CommentReplyDto getReplyById(Long replyId, Long currentUserId);
    List<CommentReplyDto> getRepliesByComment(Long commentId, Long currentUserId);
    Page<CommentReplyDto> getRepliesByUser(Long userId, Long currentUserId, Pageable pageable);

    // Like operations
    void likeComment(Long userId, Long commentId);
    void dislikeComment(Long userId, Long commentId);
    void unlikeComment(Long userId, Long commentId);
    void undislikeComment(Long userId, Long commentId);
    void likeReply(Long userId, Long replyId);
    void dislikeReply(Long userId, Long replyId);
    void unlikeReply(Long userId, Long replyId);
    void undislikeReply(Long userId, Long replyId);

    // Utility methods
    boolean canUserEditComment(Long userId, Long commentId);
    boolean canUserDeleteComment(Long userId, Long commentId);
    boolean canUserEditReply(Long userId, Long replyId);
    boolean canUserDeleteReply(Long userId, Long replyId);
    boolean isCommentLikedByUser(Long userId, Long commentId);
    boolean isCommentDislikedByUser(Long userId, Long commentId);
    boolean isReplyLikedByUser(Long userId, Long replyId);
    boolean isReplyDislikedByUser(Long userId, Long replyId);
} 