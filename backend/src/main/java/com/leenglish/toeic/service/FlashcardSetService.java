package com.leenglish.toeic.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;

import com.leenglish.toeic.domain.Flashcard;
import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.FlashcardSetCreateRequest;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.dto.FlashcardSetUpdateRequest;

public interface FlashcardSetService {
    
    // Read operations
    List<FlashcardSetDto> getAllFlashcardSets();
    List<FlashcardSetDto> getFeaturedFlashcardSets(int limit);
    FlashcardSetDto getFlashcardSetById(Long id);
    
    // CRUD operations for collaborators
    FlashcardSetDto createFlashcardSet(FlashcardSetDto flashcardSetDto);
    FlashcardSetDto updateFlashcardSet(FlashcardSetDto flashcardSetDto);
    void deleteFlashcardSet(Long id);
    
    // Search and filter
    List<FlashcardSetDto> searchFlashcardSets(String keyword);
    List<FlashcardSetDto> getFlashcardSetsByDifficulty(String difficulty);
    List<FlashcardSetDto> getFlashcardSetsByCategory(String category);
}
