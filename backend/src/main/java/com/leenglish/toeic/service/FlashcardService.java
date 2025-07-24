package com.leenglish.toeic.service;

import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.dto.FlashcardSetDto;

import java.util.List;

public interface FlashcardService {

    // FlashcardSet operations
    FlashcardSetDto createFlashcardSet(FlashcardSetDto flashcardSetDto, Long userId);

    FlashcardSetDto updateFlashcardSet(Long id, FlashcardSetDto flashcardSetDto, Long userId);

    void deleteFlashcardSet(Long id, Long userId);

    FlashcardSetDto getFlashcardSetById(Long id);

    List<FlashcardSetDto> getFlashcardSetsByUser(Long userId);

    List<FlashcardSetDto> getAllFlashcardSets(int page, int size);

    List<FlashcardSetDto> searchFlashcardSets(String keyword, int page, int size);

    // Flashcard operations
    FlashcardDto createFlashcard(FlashcardDto flashcardDto, Long setId, Long userId);

    FlashcardDto updateFlashcard(Long id, FlashcardDto flashcardDto, Long userId);

    void deleteFlashcard(Long id, Long userId);

    FlashcardDto getFlashcardById(Long id);

    List<FlashcardDto> getFlashcardsBySet(Long setId);

    // Utility methods
    List<FlashcardSetDto> getRecentFlashcardSets(int limit);

    List<FlashcardSetDto> getPopularFlashcardSets(int limit);

    void incrementViewCount(Long setId);
}
