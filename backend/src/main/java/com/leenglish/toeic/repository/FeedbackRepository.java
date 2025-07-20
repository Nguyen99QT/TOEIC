package com.leenglish.toeic.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.leenglish.toeic.domain.Feedback;
import com.leenglish.toeic.domain.Feedback.FeedbackType;
import com.leenglish.toeic.domain.Feedback.Priority;
import com.leenglish.toeic.domain.Feedback.Status;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    // Find all active feedback
    @Query("SELECT f FROM Feedback f WHERE f.isDeleted = false ORDER BY f.createdAt DESC")
    Page<Feedback> findAllActive(Pageable pageable);

    // Find feedback by ID and check if active
    @Query("SELECT f FROM Feedback f WHERE f.id = :id AND f.isDeleted = false")
    Optional<Feedback> findByIdAndActive(@Param("id") Long id);

    // Find feedback by user
    @Query("SELECT f FROM Feedback f WHERE f.user.id = :userId AND f.isDeleted = false ORDER BY f.createdAt DESC")
    Page<Feedback> findByUserIdAndActive(@Param("userId") Long userId, Pageable pageable);

    // Find feedback by status
    @Query("SELECT f FROM Feedback f WHERE f.status = :status AND f.isDeleted = false ORDER BY f.createdAt DESC")
    Page<Feedback> findByStatusAndActive(@Param("status") Status status, Pageable pageable);

    // Find feedback by priority
    @Query("SELECT f FROM Feedback f WHERE f.priority = :priority AND f.isDeleted = false ORDER BY f.createdAt DESC")
    Page<Feedback> findByPriorityAndActive(@Param("priority") Priority priority, Pageable pageable);

    // Find feedback by type
    @Query("SELECT f FROM Feedback f WHERE f.feedbackType = :feedbackType AND f.isDeleted = false ORDER BY f.createdAt DESC")
    Page<Feedback> findByFeedbackTypeAndActive(@Param("feedbackType") FeedbackType feedbackType, Pageable pageable);

    // Find pending feedback
    @Query("SELECT f FROM Feedback f WHERE f.status = 'PENDING' AND f.isDeleted = false ORDER BY f.priority DESC, f.createdAt ASC")
    Page<Feedback> findPendingFeedback(Pageable pageable);

    // Find urgent feedback
    @Query("SELECT f FROM Feedback f WHERE f.priority IN ('HIGH', 'URGENT') AND f.isDeleted = false ORDER BY f.priority DESC, f.createdAt ASC")
    Page<Feedback> findUrgentFeedback(Pageable pageable);

    // Find feedback that needs response
    @Query("SELECT f FROM Feedback f WHERE f.status IN ('PENDING', 'IN_PROGRESS') AND f.isDeleted = false ORDER BY f.priority DESC, f.createdAt ASC")
    Page<Feedback> findFeedbackNeedingResponse(Pageable pageable);

    // Count feedback by status
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.status = :status AND f.isDeleted = false")
    Long countByStatusAndActive(@Param("status") Status status);

    // Count feedback by priority
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.priority = :priority AND f.isDeleted = false")
    Long countByPriorityAndActive(@Param("priority") Priority priority);

    // Count feedback by type
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.feedbackType = :feedbackType AND f.isDeleted = false")
    Long countByFeedbackTypeAndActive(@Param("feedbackType") FeedbackType feedbackType);

    // Count urgent feedback
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.priority IN ('HIGH', 'URGENT') AND f.isDeleted = false")
    Long countUrgentFeedback();

    // Count pending feedback
    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.status = 'PENDING' AND f.isDeleted = false")
    Long countPendingFeedback();

    // Find feedback with admin response
    @Query("SELECT f FROM Feedback f WHERE f.adminResponse IS NOT NULL AND f.isDeleted = false ORDER BY f.respondedAt DESC")
    Page<Feedback> findFeedbackWithResponse(Pageable pageable);

    // Find feedback without admin response
    @Query("SELECT f FROM Feedback f WHERE f.adminResponse IS NULL AND f.isDeleted = false ORDER BY f.priority DESC, f.createdAt ASC")
    Page<Feedback> findFeedbackWithoutResponse(Pageable pageable);

    // Find feedback by admin who responded
    @Query("SELECT f FROM Feedback f WHERE f.respondedBy = :adminId AND f.isDeleted = false ORDER BY f.respondedAt DESC")
    Page<Feedback> findByRespondedBy(@Param("adminId") Long adminId, Pageable pageable);

    // Find recent feedback
    @Query("SELECT f FROM Feedback f WHERE f.isDeleted = false ORDER BY f.createdAt DESC")
    List<Feedback> findRecentFeedback(@Param("limit") int limit);

    // Search feedback by subject or content
    @Query("SELECT f FROM Feedback f WHERE f.isDeleted = false AND (f.subject LIKE %:searchTerm% OR f.content LIKE %:searchTerm%) ORDER BY f.createdAt DESC")
    Page<Feedback> searchFeedback(@Param("searchTerm") String searchTerm, Pageable pageable);

    // Find feedback by multiple criteria
    @Query("SELECT f FROM Feedback f WHERE f.isDeleted = false " +
           "AND (:status IS NULL OR f.status = :status) " +
           "AND (:priority IS NULL OR f.priority = :priority) " +
           "AND (:feedbackType IS NULL OR f.feedbackType = :feedbackType) " +
           "ORDER BY f.priority DESC, f.createdAt DESC")
    Page<Feedback> findByCriteria(@Param("status") Status status, 
                                 @Param("priority") Priority priority, 
                                 @Param("feedbackType") FeedbackType feedbackType, 
                                 Pageable pageable);
} 