package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.CommentReply;

@Repository
public interface CommentReplyRepository extends JpaRepository<CommentReply, Long> {

    // Find all active replies for a comment
    @Query("SELECT r FROM CommentReply r WHERE r.parentComment.id = :commentId AND r.isDeleted = false ORDER BY r.createdAt ASC")
    Page<CommentReply> findByParentCommentIdAndActive(@Param("commentId") Long commentId, Pageable pageable);

    // Find all active replies for a comment
    @Query("SELECT r FROM CommentReply r WHERE r.parentComment.id = :commentId AND r.isDeleted = false ORDER BY r.createdAt ASC")
    List<CommentReply> findByParentCommentIdAndActive(@Param("commentId") Long commentId);

    // Find reply by ID and check if active
    @Query("SELECT r FROM CommentReply r WHERE r.id = :id AND r.isDeleted = false")
    Optional<CommentReply> findByIdAndActive(@Param("id") Long id);

    // Find replies by user
    @Query("SELECT r FROM CommentReply r WHERE r.user.id = :userId AND r.isDeleted = false ORDER BY r.createdAt DESC")
    Page<CommentReply> findByUserIdAndActive(@Param("userId") Long userId, Pageable pageable);

    // Count active replies for a comment
    @Query("SELECT COUNT(r) FROM CommentReply r WHERE r.parentComment.id = :commentId AND r.isDeleted = false")
    Long countByParentCommentIdAndActive(@Param("commentId") Long commentId);

    // Find replies that can be edited by user
    @Query("SELECT r FROM CommentReply r WHERE r.user.id = :userId AND r.isDeleted = false ORDER BY r.createdAt DESC")
    List<CommentReply> findEditableByUserId(@Param("userId") Long userId);

    // Find recent replies
    @Query("SELECT r FROM CommentReply r WHERE r.isDeleted = false ORDER BY r.createdAt DESC")
    Page<CommentReply> findRecentReplies(Pageable pageable);

    // Find replies with high like count
    @Query("SELECT r FROM CommentReply r WHERE r.isDeleted = false AND r.likeCount > :minLikes ORDER BY r.likeCount DESC")
    Page<CommentReply> findPopularReplies(@Param("minLikes") Integer minLikes, Pageable pageable);
} 