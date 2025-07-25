package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.FlashcardStudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardStudySessionRepository extends JpaRepository<FlashcardStudySession, Long> {
    
    /**
     * Find active session for a user and flashcard set - SHOULD RETURN OPTIONAL
     */
    Optional<FlashcardStudySession> findFirstByUserIdAndFlashcardSetIdAndStatus(
            Long userId, Long flashcardSetId, FlashcardStudySession.SessionStatus status);
    
    /**
     * Find ALL sessions for a user and flashcard set - RETURNS LIST
     */
    List<FlashcardStudySession> findByUserIdAndFlashcardSetIdAndStatus(
            Long userId, Long flashcardSetId, FlashcardStudySession.SessionStatus status);
    
    /**
     * Find all sessions for a user and flashcard set (any status)
     */
    List<FlashcardStudySession> findByUserIdAndFlashcardSetId(Long userId, Long flashcardSetId);
    
    /**
     * Find all sessions for a user, ordered by creation date desc
     */
    List<FlashcardStudySession> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    /**
     * Find recent sessions for a user with limit
     */
    @Query("SELECT s FROM FlashcardStudySession s WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    List<FlashcardStudySession> findTopByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    /**
     * Count total completed sessions for a user
     */
    Long countByUserIdAndStatus(Long userId, FlashcardStudySession.SessionStatus status);
    
    /**
     * Get total study time for a user
     */
    @Query("SELECT COALESCE(SUM(s.totalTimeSpent), 0) FROM FlashcardStudySession s WHERE s.user.id = :userId AND s.status = :status")
    Long getTotalStudyTimeByUserId(@Param("userId") Long userId, @Param("status") FlashcardStudySession.SessionStatus status);
    
    /**
     * Get average accuracy for a user
     */
    @Query("SELECT COALESCE(AVG(s.accuracy), 0.0) FROM FlashcardStudySession s WHERE s.user.id = :userId AND s.status = :status AND s.accuracy > 0")
    Double getAverageAccuracyByUserId(@Param("userId") Long userId, @Param("status") FlashcardStudySession.SessionStatus status);
}