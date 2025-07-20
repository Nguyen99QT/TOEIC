package com.leenglish.toeic.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.CommentLike;
import com.leenglish.toeic.domain.CommentReply;
import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.domain.LessonComment;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.CommentReplyDto;
import com.leenglish.toeic.dto.LessonCommentDto;
import com.leenglish.toeic.dto.LessonCommentRequest;
import com.leenglish.toeic.exception.ResourceNotFoundException;
import com.leenglish.toeic.exception.UnauthorizedException;
import com.leenglish.toeic.repository.CommentLikeRepository;
import com.leenglish.toeic.repository.CommentReplyRepository;
import com.leenglish.toeic.repository.LessonCommentRepository;
import com.leenglish.toeic.repository.LessonRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.service.LessonCommentService;

@Service
@Transactional
public class LessonCommentServiceImpl implements LessonCommentService {

    @Autowired
    private LessonCommentRepository lessonCommentRepository;

    @Autowired
    private CommentReplyRepository commentReplyRepository;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    // Comment operations
    @Override
    public LessonCommentDto createComment(Long userId, Long lessonId, LessonCommentRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));

        LessonComment comment = new LessonComment(user, lesson, request.getContent());
        comment = lessonCommentRepository.save(comment);

        return convertToDto(comment, userId);
    }

    @Override
    public LessonCommentDto updateComment(Long userId, Long commentId, LessonCommentRequest request) {
        LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        if (!comment.canBeEdited()) {
            throw new UnauthorizedException("Comment cannot be edited");
        }

        comment.setContent(request.getContent());
        comment = lessonCommentRepository.save(comment);

        return convertToDto(comment, userId);
    }

    @Override
    public void deleteComment(Long userId, Long commentId) {
        LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        if (!comment.canBeDeleted()) {
            throw new UnauthorizedException("Comment cannot be deleted");
        }

        comment.setIsDeleted(true);
        lessonCommentRepository.save(comment);
    }

    @Override
    public LessonCommentDto getCommentById(Long commentId, Long currentUserId) {
        LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        return convertToDto(comment, currentUserId);
    }

    @Override
    public Page<LessonCommentDto> getCommentsByLesson(Long lessonId, Long currentUserId, Pageable pageable) {
        Page<LessonComment> comments = lessonCommentRepository.findByLessonIdAndActive(lessonId, pageable);
        return comments.map(comment -> convertToDto(comment, currentUserId));
    }

    @Override
    public Page<LessonCommentDto> getCommentsByUser(Long userId, Long currentUserId, Pageable pageable) {
        Page<LessonComment> comments = lessonCommentRepository.findByUserIdAndActive(userId, pageable);
        return comments.map(comment -> convertToDto(comment, currentUserId));
    }

    @Override
    public Page<LessonCommentDto> getRecentComments(Long currentUserId, Pageable pageable) {
        Page<LessonComment> comments = lessonCommentRepository.findRecentComments(pageable);
        return comments.map(comment -> convertToDto(comment, currentUserId));
    }

    @Override
    public Page<LessonCommentDto> getPopularComments(Long currentUserId, Pageable pageable) {
        Page<LessonComment> comments = lessonCommentRepository.findPopularComments(5, pageable);
        return comments.map(comment -> convertToDto(comment, currentUserId));
    }

    @Override
    public Long getCommentCountByLesson(Long lessonId) {
        return lessonCommentRepository.countByLessonIdAndActive(lessonId);
    }

    // Reply operations
    @Override
    public CommentReplyDto createReply(Long userId, Long commentId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LessonComment parentComment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        CommentReply reply = new CommentReply(user, parentComment, content);
        reply = commentReplyRepository.save(reply);

        return convertReplyToDto(reply, userId);
    }

    @Override
    public CommentReplyDto updateReply(Long userId, Long replyId, String content) {
        CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        if (!reply.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only edit your own replies");
        }

        if (!reply.canBeEdited()) {
            throw new UnauthorizedException("Reply cannot be edited");
        }

        reply.setContent(content);
        reply = commentReplyRepository.save(reply);

        return convertReplyToDto(reply, userId);
    }

    @Override
    public void deleteReply(Long userId, Long replyId) {
        CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        if (!reply.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only delete your own replies");
        }

        if (!reply.canBeDeleted()) {
            throw new UnauthorizedException("Reply cannot be deleted");
        }

        reply.setIsDeleted(true);
        commentReplyRepository.save(reply);
    }

    @Override
    public CommentReplyDto getReplyById(Long replyId, Long currentUserId) {
        CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        return convertReplyToDto(reply, currentUserId);
    }

    @Override
    public List<CommentReplyDto> getRepliesByComment(Long commentId, Long currentUserId) {
        List<CommentReply> replies = commentReplyRepository.findByParentCommentIdAndActive(commentId);
        return replies.stream()
                .map(reply -> convertReplyToDto(reply, currentUserId))
                .collect(Collectors.toList());
    }

    @Override
    public Page<CommentReplyDto> getRepliesByUser(Long userId, Long currentUserId, Pageable pageable) {
        Page<CommentReply> replies = commentReplyRepository.findByUserIdAndActive(userId, pageable);
        return replies.map(reply -> convertReplyToDto(reply, currentUserId));
    }

    // Like operations
    @Override
    public void likeComment(Long userId, Long commentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Optional<CommentLike> existingLike = commentLikeRepository.findByUserIdAndCommentId(userId, commentId);
        
        if (existingLike.isPresent()) {
            CommentLike like = existingLike.get();
            if (like.isLike()) {
                return; // Already liked
            } else {
                // Change from dislike to like
                like.setLikeType(CommentLike.LikeType.LIKE);
                commentLikeRepository.save(like);
                comment.decrementDislikeCount();
                comment.incrementLikeCount();
            }
        } else {
            // Create new like
            CommentLike like = new CommentLike(user, comment, CommentLike.LikeType.LIKE);
            commentLikeRepository.save(like);
            comment.incrementLikeCount();
        }

        lessonCommentRepository.save(comment);
    }

    @Override
    public void dislikeComment(Long userId, Long commentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Optional<CommentLike> existingLike = commentLikeRepository.findByUserIdAndCommentId(userId, commentId);
        
        if (existingLike.isPresent()) {
            CommentLike like = existingLike.get();
            if (like.isDislike()) {
                return; // Already disliked
            } else {
                // Change from like to dislike
                like.setLikeType(CommentLike.LikeType.DISLIKE);
                commentLikeRepository.save(like);
                comment.decrementLikeCount();
                comment.incrementDislikeCount();
            }
        } else {
            // Create new dislike
            CommentLike like = new CommentLike(user, comment, CommentLike.LikeType.DISLIKE);
            commentLikeRepository.save(like);
            comment.incrementDislikeCount();
        }

        lessonCommentRepository.save(comment);
    }

    @Override
    public void unlikeComment(Long userId, Long commentId) {
        Optional<CommentLike> like = commentLikeRepository.findByUserIdAndCommentId(userId, commentId);
        if (like.isPresent() && like.get().isLike()) {
            LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
            
            commentLikeRepository.delete(like.get());
            comment.decrementLikeCount();
            lessonCommentRepository.save(comment);
        }
    }

    @Override
    public void undislikeComment(Long userId, Long commentId) {
        Optional<CommentLike> like = commentLikeRepository.findByUserIdAndCommentId(userId, commentId);
        if (like.isPresent() && like.get().isDislike()) {
            LessonComment comment = lessonCommentRepository.findByIdAndActive(commentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
            
            commentLikeRepository.delete(like.get());
            comment.decrementDislikeCount();
            lessonCommentRepository.save(comment);
        }
    }

    @Override
    public void likeReply(Long userId, Long replyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        Optional<CommentLike> existingLike = commentLikeRepository.findByUserIdAndReplyId(userId, replyId);
        
        if (existingLike.isPresent()) {
            CommentLike like = existingLike.get();
            if (like.isLike()) {
                return; // Already liked
            } else {
                // Change from dislike to like
                like.setLikeType(CommentLike.LikeType.LIKE);
                commentLikeRepository.save(like);
                reply.decrementDislikeCount();
                reply.incrementLikeCount();
            }
        } else {
            // Create new like
            CommentLike like = new CommentLike(user, reply, CommentLike.LikeType.LIKE);
            commentLikeRepository.save(like);
            reply.incrementLikeCount();
        }

        commentReplyRepository.save(reply);
    }

    @Override
    public void dislikeReply(Long userId, Long replyId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        Optional<CommentLike> existingLike = commentLikeRepository.findByUserIdAndReplyId(userId, replyId);
        
        if (existingLike.isPresent()) {
            CommentLike like = existingLike.get();
            if (like.isDislike()) {
                return; // Already disliked
            } else {
                // Change from like to dislike
                like.setLikeType(CommentLike.LikeType.DISLIKE);
                commentLikeRepository.save(like);
                reply.decrementLikeCount();
                reply.incrementDislikeCount();
            }
        } else {
            // Create new dislike
            CommentLike like = new CommentLike(user, reply, CommentLike.LikeType.DISLIKE);
            commentLikeRepository.save(like);
            reply.incrementDislikeCount();
        }

        commentReplyRepository.save(reply);
    }

    @Override
    public void unlikeReply(Long userId, Long replyId) {
        Optional<CommentLike> like = commentLikeRepository.findByUserIdAndReplyId(userId, replyId);
        if (like.isPresent() && like.get().isLike()) {
            CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));
            
            commentLikeRepository.delete(like.get());
            reply.decrementLikeCount();
            commentReplyRepository.save(reply);
        }
    }

    @Override
    public void undislikeReply(Long userId, Long replyId) {
        Optional<CommentLike> like = commentLikeRepository.findByUserIdAndReplyId(userId, replyId);
        if (like.isPresent() && like.get().isDislike()) {
            CommentReply reply = commentReplyRepository.findByIdAndActive(replyId)
                    .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));
            
            commentLikeRepository.delete(like.get());
            reply.decrementDislikeCount();
            commentReplyRepository.save(reply);
        }
    }

    // Utility methods
    @Override
    public boolean canUserEditComment(Long userId, Long commentId) {
        Optional<LessonComment> comment = lessonCommentRepository.findByIdAndActive(commentId);
        return comment.isPresent() && 
               comment.get().getUser().getId().equals(userId) && 
               comment.get().canBeEdited();
    }

    @Override
    public boolean canUserDeleteComment(Long userId, Long commentId) {
        Optional<LessonComment> comment = lessonCommentRepository.findByIdAndActive(commentId);
        return comment.isPresent() && 
               comment.get().getUser().getId().equals(userId) && 
               comment.get().canBeDeleted();
    }

    @Override
    public boolean canUserEditReply(Long userId, Long replyId) {
        Optional<CommentReply> reply = commentReplyRepository.findByIdAndActive(replyId);
        return reply.isPresent() && 
               reply.get().getUser().getId().equals(userId) && 
               reply.get().canBeEdited();
    }

    @Override
    public boolean canUserDeleteReply(Long userId, Long replyId) {
        Optional<CommentReply> reply = commentReplyRepository.findByIdAndActive(replyId);
        return reply.isPresent() && 
               reply.get().getUser().getId().equals(userId) && 
               reply.get().canBeDeleted();
    }

    @Override
    public boolean isCommentLikedByUser(Long userId, Long commentId) {
        return commentLikeRepository.existsLikeByUserIdAndCommentId(userId, commentId);
    }

    @Override
    public boolean isCommentDislikedByUser(Long userId, Long commentId) {
        return commentLikeRepository.existsDislikeByUserIdAndCommentId(userId, commentId);
    }

    @Override
    public boolean isReplyLikedByUser(Long userId, Long replyId) {
        return commentLikeRepository.existsLikeByUserIdAndReplyId(userId, replyId);
    }

    @Override
    public boolean isReplyDislikedByUser(Long userId, Long replyId) {
        return commentLikeRepository.existsDislikeByUserIdAndReplyId(userId, replyId);
    }

    // Helper methods
    private LessonCommentDto convertToDto(LessonComment comment, Long currentUserId) {
        LessonCommentDto dto = new LessonCommentDto();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getUsername());
        dto.setUserAvatar(comment.getUser().getAvatarUrl());
        dto.setLessonId(comment.getLesson().getId());
        dto.setContent(comment.getContent());
        dto.setIsEdited(comment.getIsEdited());
        dto.setEditedAt(comment.getEditedAt());
        dto.setIsDeleted(comment.getIsDeleted());
        dto.setDeletedAt(comment.getDeletedAt());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        dto.setLikeCount(comment.getLikeCount());
        dto.setDislikeCount(comment.getDislikeCount());
        
        // Set replies
        List<CommentReplyDto> replies = comment.getReplies().stream()
                .filter(reply -> !reply.getIsDeleted())
                .map(reply -> convertReplyToDto(reply, currentUserId))
                .collect(Collectors.toList());
        dto.setReplies(replies);
        
        // Set user interaction flags
        if (currentUserId != null) {
            dto.setIsLikedByCurrentUser(isCommentLikedByUser(currentUserId, comment.getId()));
            dto.setIsDislikedByCurrentUser(isCommentDislikedByUser(currentUserId, comment.getId()));
            dto.setCanEdit(canUserEditComment(currentUserId, comment.getId()));
            dto.setCanDelete(canUserDeleteComment(currentUserId, comment.getId()));
        }
        
        return dto;
    }

    private CommentReplyDto convertReplyToDto(CommentReply reply, Long currentUserId) {
        CommentReplyDto dto = new CommentReplyDto();
        dto.setId(reply.getId());
        dto.setUserId(reply.getUser().getId());
        dto.setUserName(reply.getUser().getUsername());
        dto.setUserAvatar(reply.getUser().getAvatarUrl());
        dto.setParentCommentId(reply.getParentComment().getId());
        dto.setContent(reply.getContent());
        dto.setIsEdited(reply.getIsEdited());
        dto.setEditedAt(reply.getEditedAt());
        dto.setIsDeleted(reply.getIsDeleted());
        dto.setDeletedAt(reply.getDeletedAt());
        dto.setCreatedAt(reply.getCreatedAt());
        dto.setUpdatedAt(reply.getUpdatedAt());
        dto.setLikeCount(reply.getLikeCount());
        dto.setDislikeCount(reply.getDislikeCount());
        
        // Set user interaction flags
        if (currentUserId != null) {
            dto.setIsLikedByCurrentUser(isReplyLikedByUser(currentUserId, reply.getId()));
            dto.setIsDislikedByCurrentUser(isReplyDislikedByUser(currentUserId, reply.getId()));
            dto.setCanEdit(canUserEditReply(currentUserId, reply.getId()));
            dto.setCanDelete(canUserDeleteReply(currentUserId, reply.getId()));
        }
        
        return dto;
    }
} 