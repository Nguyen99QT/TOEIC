package com.leenglish.toeic.service.impl;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.repository.FlashcardRepository;
import com.leenglish.toeic.service.FlashcardService;
import com.leenglish.toeic.service.FlashcardSetService;

@Service
public class FlashcardSetServiceImpl implements FlashcardSetService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardService flashcardService;

    @Autowired
    private FlashcardRepository flashcardRepository;

    // ========== MAIN CRUD METHODS ==========

    @Override
    public List<FlashcardSetDto> getAllFlashcardSets() {
        List<FlashcardSet> sets = flashcardSetRepository.findAll();
        return sets.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> getFeaturedFlashcardSets(int limit) {
        // Use simpler query for now
        List<FlashcardSet> sets = flashcardSetRepository.findAll();
        return sets.stream()
                .filter(set -> set.getIsPublic() != null && set.getIsPublic())
                .limit(limit)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public FlashcardSetDto getFlashcardSetById(Long id) {
        FlashcardSet set = flashcardSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardSet not found with id: " + id));
        return mapToDto(set);
    }

    @Override
    public FlashcardSetDto createFlashcardSet(FlashcardSetDto flashcardSetDto) {
        FlashcardSet set = new FlashcardSet();
        set.setTitle(flashcardSetDto.getTitle());
        set.setDescription(flashcardSetDto.getDescription());
        set.setDifficultyLevel(flashcardSetDto.getDifficultyLevel());
        set.setCategory(flashcardSetDto.getCategory());
        set.setIsPublic(flashcardSetDto.getIsPublic());
        set.setIsPremium(false);
        set.setEstimatedTimeMinutes(30);
        set.setViewCount(0);
        set.setCreatedAt(LocalDateTime.now());
        set.setUpdatedAt(LocalDateTime.now());

        FlashcardSet savedSet = flashcardSetRepository.save(set);
        return mapToDto(savedSet);
    }

    @Override
    public FlashcardSetDto updateFlashcardSet(FlashcardSetDto flashcardSetDto) {
        FlashcardSet existingSet = flashcardSetRepository.findById(flashcardSetDto.getId())
                .orElseThrow(() -> new RuntimeException("FlashcardSet not found with id: " + flashcardSetDto.getId()));

        existingSet.setTitle(flashcardSetDto.getTitle());
        existingSet.setDescription(flashcardSetDto.getDescription());
        existingSet.setDifficultyLevel(flashcardSetDto.getDifficultyLevel());
        existingSet.setCategory(flashcardSetDto.getCategory());
        existingSet.setIsPublic(flashcardSetDto.getIsPublic());
        existingSet.setUpdatedAt(LocalDateTime.now());

        FlashcardSet updatedSet = flashcardSetRepository.save(existingSet);
        return mapToDto(updatedSet);
    }

    @Override
    public void deleteFlashcardSet(Long id) {
        FlashcardSet set = flashcardSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FlashcardSet not found with id: " + id));
        flashcardSetRepository.delete(set);
    }

    @Override
    public List<FlashcardSetDto> searchFlashcardSets(String keyword) {
        // Simple search implementation
        List<FlashcardSet> allSets = flashcardSetRepository.findAll();
        return allSets.stream()
                .filter(set -> (set.getTitle() != null && set.getTitle().toLowerCase().contains(keyword.toLowerCase()))
                        ||
                        (set.getDescription() != null
                                && set.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> getFlashcardSetsByDifficulty(String difficulty) {
        List<FlashcardSet> allSets = flashcardSetRepository.findAll();
        return allSets.stream()
                .filter(set -> difficulty.equals(set.getDifficultyLevel()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> getFlashcardSetsByCategory(String category) {
        List<FlashcardSet> allSets = flashcardSetRepository.findAll();
        return allSets.stream()
                .filter(set -> category.equals(set.getCategory()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ========== MAPPING METHOD ==========

    private FlashcardSetDto mapToDto(FlashcardSet set) {
        FlashcardSetDto dto = new FlashcardSetDto();
        dto.setId(set.getId());
        dto.setTitle(set.getTitle());
        dto.setDescription(set.getDescription());
        dto.setIsPublic(set.getIsPublic());
        dto.setIsPremium(set.getIsPremium());
        dto.setEstimatedTimeMinutes(set.getEstimatedTimeMinutes());
        dto.setViewCount(set.getViewCount());
        dto.setCreatedAt(set.getCreatedAt());
        dto.setUpdatedAt(set.getUpdatedAt());
        dto.setDifficultyLevel(set.getDifficultyLevel());
        dto.setCategory(set.getCategory());

        // Count flashcards in the set
        if (set.getId() != null) {
            int flashcardCount = flashcardRepository.countByFlashcardSetId(set.getId());
            dto.setFlashcardCount(flashcardCount);
            dto.setCardCount(flashcardCount);
        }

        return dto;
    }
}
