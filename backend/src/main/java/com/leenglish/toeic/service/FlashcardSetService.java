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

    FlashcardSetDto getFlashcardSetWithFlashcardsById(Long id, Authentication authentication);

    FlashcardSetDto getFreeFlashcardSetById(Long id);

    // Thêm các method sau:

    /**
     * Lấy danh sách các bộ flashcard công khai.
     * 
     * @return Danh sách các bộ flashcard công khai.
     */
    Page<FlashcardSet> getPublicSets(String difficulty, String category, String search, Pageable pageable);

    FlashcardSet getSetById(Long id);

    boolean canUserAccessSet(User user, FlashcardSet set);

    boolean canUserModifySet(User user, FlashcardSet set);

    List<FlashcardSetDto> getPublicFlashcardSets();

    List<FlashcardSetDto> getFreeFlashcardSetsForBasicUsers();

    List<FlashcardSetDto> getFlashcardSetsByUser(Long userId);

    List<FlashcardSetDto> getAccessibleFlashcardSets(Long userId);

    FlashcardSetDto createFlashcardSet(FlashcardSetDto setDto, Long userId);

    FlashcardSetDto updateFlashcardSet(Long id, FlashcardSetDto setDto);

    void deleteFlashcardSet(Long id);

    List<FlashcardSetDto> searchFlashcardSets(String query, Long userId);

    void incrementViewCount(Long id);

    List<Flashcard> getFlashcardsBySetId(Long id);

    FlashcardSet createSet(FlashcardSetCreateRequest request, User user);

    FlashcardSet updateSet(Long id, FlashcardSetUpdateRequest request, User user);

    void deleteSet(Long id);

    /**
     * Get all flashcard sets (for admin/debugging purposes)
     * 
     * @return List of all flashcard sets
     */
    List<FlashcardSetDto> getAllFlashcardSets();
}
