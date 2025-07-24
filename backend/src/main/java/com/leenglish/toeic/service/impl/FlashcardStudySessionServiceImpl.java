package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.FlashcardStudySession;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.FlashcardStudySessionDto;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.repository.FlashcardStudySessionRepository;
import com.leenglish.toeic.repository.UserRepository;
import com.leenglish.toeic.service.FlashcardStudySessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlashcardStudySessionServiceImpl implements FlashcardStudySessionService {

    @Autowired
    private FlashcardStudySessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Override
    public FlashcardStudySessionDto startStudySession(Long userId, Long flashcardSetId, String studyMode) {
        // FIX: Use the correct method that returns Optional
        Optional<FlashcardStudySession> existingSession = sessionRepository
                .findFirstByUserIdAndFlashcardSetIdAndStatus(userId, flashcardSetId,
                        FlashcardStudySession.SessionStatus.ACTIVE);

        if (existingSession.isPresent()) {
            return convertToDto(existingSession.get());
        }

        // Get user and flashcard set
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FlashcardSet flashcardSet = flashcardSetRepository.findById(flashcardSetId)
                .orElseThrow(() -> new RuntimeException("Flashcard set not found"));

        // Create new session
        FlashcardStudySession session = new FlashcardStudySession();
        session.setUser(user);
        session.setFlashcardSet(flashcardSet);
        session.setStudyMode(FlashcardStudySession.StudyMode.valueOf(studyMode));
        session.setStartTime(LocalDateTime.now());
        session.setStatus(FlashcardStudySession.SessionStatus.ACTIVE);

        session = sessionRepository.save(session);
        return convertToDto(session);
    }

    @Override
    public FlashcardStudySessionDto submitAnswer(Long sessionId, Long cardId, Boolean isCorrect, Integer timeSpent) {
        FlashcardStudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // Update answer counts
        if (isCorrect) {
            session.setCorrectAnswers(session.getCorrectAnswers() + 1);
        } else {
            session.setWrongAnswers(session.getWrongAnswers() + 1);
        }

        // Add to studied cards
        session.getStudiedCards().add(cardId);

        // Update time spent
        session.setTotalTimeSpent(session.getTotalTimeSpent() + timeSpent);

        // Recalculate accuracy
        session.setAccuracy(session.calculateAccuracy());

        session = sessionRepository.save(session);
        return convertToDto(session);
    }

    @Override
    public FlashcardStudySessionDto markCardAsMastered(Long sessionId, Long cardId) {
        FlashcardStudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.getMasteredCards().add(cardId);
        session = sessionRepository.save(session);

        return convertToDto(session);
    }

    @Override
    public FlashcardStudySessionDto completeSession(Long sessionId) {
        FlashcardStudySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(FlashcardStudySession.SessionStatus.COMPLETED);
        session.setEndTime(LocalDateTime.now());
        session.setAccuracy(session.calculateAccuracy());

        session = sessionRepository.save(session);
        return convertToDto(session);
    }

    @Override
    public Map<String, Object> getUserProgress(Long userId, Long flashcardSetId) {
        // Use the method that returns List and filter for completed sessions
        List<FlashcardStudySession> completedSessions = sessionRepository
                .findByUserIdAndFlashcardSetIdAndStatus(userId, flashcardSetId,
                        FlashcardStudySession.SessionStatus.COMPLETED);

        Map<String, Object> progress = new HashMap<>();

        if (completedSessions.isEmpty()) {
            progress.put("completedSessions", 0);
            progress.put("totalStudyTime", 0);
            progress.put("averageAccuracy", 0.0);
            progress.put("lastStudiedAt", null);
            progress.put("streakCount", 0);
        } else {
            progress.put("completedSessions", completedSessions.size());
            progress.put("totalStudyTime",
                    completedSessions.stream().mapToInt(FlashcardStudySession::getTotalTimeSpent).sum());
            progress.put("averageAccuracy",
                    completedSessions.stream().mapToDouble(FlashcardStudySession::getAccuracy).average().orElse(0.0));
            progress.put("lastStudiedAt", completedSessions.stream()
                    .max(Comparator.comparing(FlashcardStudySession::getEndTime))
                    .map(FlashcardStudySession::getEndTime)
                    .orElse(null));
            progress.put("streakCount", calculateStreakCount(completedSessions));
        }

        return progress;
    }

    @Override
    public Map<String, Object> getUserStudyStats(Long userId) {
        Long completedSessions = sessionRepository.countByUserIdAndStatus(userId,
                FlashcardStudySession.SessionStatus.COMPLETED);
        Long totalStudyTime = sessionRepository.getTotalStudyTimeByUserId(userId,
                FlashcardStudySession.SessionStatus.COMPLETED);
        Double averageAccuracy = sessionRepository.getAverageAccuracyByUserId(userId,
                FlashcardStudySession.SessionStatus.COMPLETED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSessions", completedSessions);
        stats.put("totalStudyTime", totalStudyTime);
        stats.put("averageAccuracy", averageAccuracy);
        stats.put("studyStreak", calculateOverallStreak(userId));

        return stats;
    }

    @Override
    public Optional<FlashcardStudySessionDto> getActiveSession(Long userId, Long flashcardSetId) {
        // FIX: Use the correct method that returns Optional
        return sessionRepository.findFirstByUserIdAndFlashcardSetIdAndStatus(
                userId, flashcardSetId, FlashcardStudySession.SessionStatus.ACTIVE)
                .map(this::convertToDto);
    }

    @Override
    public List<FlashcardStudySessionDto> getUserStudyHistory(Long userId, int limit) {
        // FIX: Use the correct repository method and stream mapping
        List<FlashcardStudySession> sessions = sessionRepository.findTopByUserIdOrderByCreatedAtDesc(userId);
        return sessions.stream()
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper methods
    private FlashcardStudySessionDto convertToDto(FlashcardStudySession session) {
        FlashcardStudySessionDto dto = new FlashcardStudySessionDto();
        dto.setId(session.getId());
        dto.setUserId(session.getUser().getId());
        dto.setFlashcardSetId(session.getFlashcardSet().getId());
        dto.setStudyMode(session.getStudyMode().name());
        dto.setStartTime(session.getStartTime());
        dto.setEndTime(session.getEndTime());
        dto.setCorrectAnswers(session.getCorrectAnswers());
        dto.setWrongAnswers(session.getWrongAnswers());
        dto.setTotalTimeSpent(session.getTotalTimeSpent());
        dto.setStatus(session.getStatus().name());
        dto.setAccuracy(session.getAccuracy());
        dto.setStudiedCards(session.getStudiedCards());
        dto.setMasteredCards(session.getMasteredCards());
        return dto;
    }

    private int calculateStreakCount(List<FlashcardStudySession> sessions) {
        if (sessions.isEmpty())
            return 0;

        // Sort sessions by end time (most recent first)
        List<FlashcardStudySession> sortedSessions = sessions.stream()
                .filter(s -> s.getEndTime() != null)
                .sorted((a, b) -> b.getEndTime().compareTo(a.getEndTime()))
                .collect(Collectors.toList());

        if (sortedSessions.isEmpty())
            return 0;

        int streak = 1;
        LocalDateTime currentDate = sortedSessions.get(0).getEndTime().toLocalDate().atStartOfDay();

        for (int i = 1; i < sortedSessions.size(); i++) {
            LocalDateTime sessionDate = sortedSessions.get(i).getEndTime().toLocalDate().atStartOfDay();

            // Check if session is from the previous day
            if (sessionDate.plusDays(1).equals(currentDate)) {
                streak++;
                currentDate = sessionDate;
            } else {
                break; // Streak broken
            }
        }

        return streak;
    }

    private int calculateOverallStreak(Long userId) {
        // Get all completed sessions for the user
        List<FlashcardStudySession> allSessions = sessionRepository
                .findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(s -> s.getStatus() == FlashcardStudySession.SessionStatus.COMPLETED && s.getEndTime() != null)
                .collect(Collectors.toList());

        return calculateStreakCount(allSessions);
    }
}