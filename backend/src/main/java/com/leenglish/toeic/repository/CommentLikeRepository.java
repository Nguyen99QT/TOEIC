package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.CommentLike;
import com.leenglish.toeic.domain.CommentLike.LikeType;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    // Find like by user and comment
    @Query("SELECT cl FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id = :commentId")
    Optional<CommentLike> findByUserIdAndCommentId(@Param("userId") Long userId, @Param("commentId") Long commentId);

    // Find like by user and reply
    @Query("SELECT cl FROM CommentLike cl WHERE cl.user.id = :userId AND cl.reply.id = :replyId")
    Optional<CommentLike> findByUserIdAndReplyId(@Param("userId") Long userId, @Param("replyId") Long replyId);

    // Check if user liked a comment
    @Query("SELECT COUNT(cl) > 0 FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id = :commentId AND cl.likeType = 'LIKE'")
    boolean existsLikeByUserIdAndCommentId(@Param("userId") Long userId, @Param("commentId") Long commentId);

    // Check if user disliked a comment
    @Query("SELECT COUNT(cl) > 0 FROM CommentLike cl WHERE cl.user.id = :userId AND cl.comment.id = :commentId AND cl.likeType = 'DISLIKE'")
    boolean existsDislikeByUserIdAndCommentId(@Param("userId") Long userId, @Param("commentId") Long commentId);

    // Check if user liked a reply
    @Query("SELECT COUNT(cl) > 0 FROM CommentLike cl WHERE cl.user.id = :userId AND cl.reply.id = :replyId AND cl.likeType = 'LIKE'")
    boolean existsLikeByUserIdAndReplyId(@Param("userId") Long userId, @Param("replyId") Long replyId);

    // Check if user disliked a reply
    @Query("SELECT COUNT(cl) > 0 FROM CommentLike cl WHERE cl.user.id = :userId AND cl.reply.id = :replyId AND cl.likeType = 'DISLIKE'")
    boolean existsDislikeByUserIdAndReplyId(@Param("userId") Long userId, @Param("replyId") Long replyId);

    // Count likes for a comment
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.likeType = 'LIKE'")
    Long countLikesByCommentId(@Param("commentId") Long commentId);

    // Count dislikes for a comment
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.likeType = 'DISLIKE'")
    Long countDislikesByCommentId(@Param("commentId") Long commentId);

    // Count likes for a reply
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.reply.id = :replyId AND cl.likeType = 'LIKE'")
    Long countLikesByReplyId(@Param("replyId") Long replyId);

    // Count dislikes for a reply
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.reply.id = :replyId AND cl.likeType = 'DISLIKE'")
    Long countDislikesByReplyId(@Param("replyId") Long replyId);

    // Find all likes by user
    @Query("SELECT cl FROM CommentLike cl WHERE cl.user.id = :userId")
    List<CommentLike> findByUserId(@Param("userId") Long userId);

    // Find likes by type for a comment
    @Query("SELECT cl FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.likeType = :likeType")
    List<CommentLike> findByCommentIdAndLikeType(@Param("commentId") Long commentId, @Param("likeType") LikeType likeType);

    // Find likes by type for a reply
    @Query("SELECT cl FROM CommentLike cl WHERE cl.reply.id = :replyId AND cl.likeType = :likeType")
    List<CommentLike> findByReplyIdAndLikeType(@Param("replyId") Long replyId, @Param("likeType") LikeType likeType);

    // Delete likes for a comment
    @Query("DELETE FROM CommentLike cl WHERE cl.comment.id = :commentId")
    void deleteByCommentId(@Param("commentId") Long commentId);

    // Delete likes for a reply
    @Query("DELETE FROM CommentLike cl WHERE cl.reply.id = :replyId")
    void deleteByReplyId(@Param("replyId") Long replyId);
} 