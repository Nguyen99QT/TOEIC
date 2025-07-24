package com.leenglish.toeic.service;

import com.leenglish.toeic.dto.FlashcardStudySessionDto;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface FlashcardStudySessionService {
    
    /**
     * Start a new study session for a flashcard set
     */
    FlashcardStudySessionDto startStudySession(Long userId, Long flashcardSetId, String studyMode);
    
    /**
     * Submit an answer for a flashcard in the current session
     */
    FlashcardStudySessionDto submitAnswer(Long sessionId, Long cardId, Boolean isCorrect, Integer timeSpent);
    
    /**
     * Mark a flashcard as mastered in the current session
     */
    FlashcardStudySessionDto markCardAsMastered(Long sessionId, Long cardId);
    
    /**
     * Complete the current study session
     */
    FlashcardStudySessionDto completeSession(Long sessionId);
    
    /**
     * Get user's progress for a specific flashcard set
     */
    Map<String, Object> getUserProgress(Long userId, Long flashcardSetId);
    
    /**
     * Get user's overall study statistics
     */
    Map<String, Object> getUserStudyStats(Long userId);
    
    /**
     * Get active session for a user and flashcard set
     */
    Optional<FlashcardStudySessionDto> getActiveSession(Long userId, Long flashcardSetId);
    
    /**
     * Get user's study history
     */
    List<FlashcardStudySessionDto> getUserStudyHistory(Long userId, int limit);
}