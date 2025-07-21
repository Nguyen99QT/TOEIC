package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.LessonComment;

@Repository
public interface LessonCommentRepository extends JpaRepository<LessonComment, Long> {

    // Find all active comments for a lesson
    @Query("SELECT c FROM LessonComment c WHERE c.lesson.id = :lessonId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<LessonComment> findByLessonIdAndActive(@Param("lessonId") Long lessonId, Pageable pageable);

    // Find all active comments for a lesson with replies
    @Query("SELECT c FROM LessonComment c LEFT JOIN FETCH c.replies r WHERE c.lesson.id = :lessonId AND c.isDeleted = false AND (r IS NULL OR r.isDeleted = false) ORDER BY c.createdAt DESC")
    List<LessonComment> findByLessonIdWithReplies(@Param("lessonId") Long lessonId);

    // Find comment by ID and check if active
    @Query("SELECT c FROM LessonComment c WHERE c.id = :id AND c.isDeleted = false")
    Optional<LessonComment> findByIdAndActive(@Param("id") Long id);

    // Find comments by user
    @Query("SELECT c FROM LessonComment c WHERE c.user.id = :userId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<LessonComment> findByUserIdAndActive(@Param("userId") Long userId, Pageable pageable);

    // Count active comments for a lesson
    @Query("SELECT COUNT(c) FROM LessonComment c WHERE c.lesson.id = :lessonId AND c.isDeleted = false")
    Long countByLessonIdAndActive(@Param("lessonId") Long lessonId);

    // Find comments that can be edited by user
    @Query("SELECT c FROM LessonComment c WHERE c.user.id = :userId AND c.isDeleted = false ORDER BY c.createdAt DESC")
    List<LessonComment> findEditableByUserId(@Param("userId") Long userId);

    // Find recent comments
    @Query("SELECT c FROM LessonComment c WHERE c.isDeleted = false ORDER BY c.createdAt DESC")
    Page<LessonComment> findRecentComments(Pageable pageable);

    // Find comments with high like count
    @Query("SELECT c FROM LessonComment c WHERE c.isDeleted = false AND c.likeCount > :minLikes ORDER BY c.likeCount DESC")
    Page<LessonComment> findPopularComments(@Param("minLikes") Integer minLikes, Pageable pageable);

    // Check if user has commented on lesson
    @Query("SELECT COUNT(c) > 0 FROM LessonComment c WHERE c.user.id = :userId AND c.lesson.id = :lessonId AND c.isDeleted = false")
    boolean existsByUserIdAndLessonId(@Param("userId") Long userId, @Param("lessonId") Long lessonId);

    // Find comments by lesson and user
    @Query("SELECT c FROM LessonComment c WHERE c.user.id = :userId AND c.lesson.id = :lessonId AND c.isDeleted = false")
    Optional<LessonComment> findByUserIdAndLessonId(@Param("userId") Long userId, @Param("lessonId") Long lessonId);
} 