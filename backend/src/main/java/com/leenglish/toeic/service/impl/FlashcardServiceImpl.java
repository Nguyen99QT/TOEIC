package com.leenglish.toeic.service.impl;

import com.leenglish.toeic.domain.Flashcard;
import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.repository.FlashcardRepository;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlashcardServiceImpl implements FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    // FlashcardSet operations
    @Override
    public FlashcardSetDto createFlashcardSet(FlashcardSetDto flashcardSetDto, Long userId) {
        FlashcardSet flashcardSet = new FlashcardSet();
        flashcardSet.setTitle(flashcardSetDto.getTitle());
        flashcardSet.setDescription(flashcardSetDto.getDescription());
        flashcardSet.setCategory(flashcardSetDto.getCategory());
        flashcardSet.setDifficultyLevel(flashcardSetDto.getDifficultyLevel());
        flashcardSet.setIsPublic(flashcardSetDto.getIsPublic() != null ? flashcardSetDto.getIsPublic() : false);
        flashcardSet.setCreatedAt(LocalDateTime.now());
        flashcardSet.setUpdatedAt(LocalDateTime.now());

        FlashcardSet savedFlashcardSet = flashcardSetRepository.save(flashcardSet);
        return convertToDto(savedFlashcardSet);
    }

    @Override
    public FlashcardSetDto updateFlashcardSet(Long id, FlashcardSetDto flashcardSetDto, Long userId) {
        Optional<FlashcardSet> existingSetOpt = flashcardSetRepository.findById(id);
        if (!existingSetOpt.isPresent()) {
            throw new RuntimeException("FlashcardSet not found with id: " + id);
        }

        FlashcardSet existingSet = existingSetOpt.get();
        existingSet.setTitle(flashcardSetDto.getTitle());
        existingSet.setDescription(flashcardSetDto.getDescription());
        existingSet.setCategory(flashcardSetDto.getCategory());
        existingSet.setDifficultyLevel(flashcardSetDto.getDifficultyLevel());
        existingSet.setIsPublic(flashcardSetDto.getIsPublic() != null ? flashcardSetDto.getIsPublic() : false);
        existingSet.setUpdatedAt(LocalDateTime.now());

        FlashcardSet updatedFlashcardSet = flashcardSetRepository.save(existingSet);
        return convertToDto(updatedFlashcardSet);
    }

    @Override
    public void deleteFlashcardSet(Long id, Long userId) {
        Optional<FlashcardSet> flashcardSetOpt = flashcardSetRepository.findById(id);
        if (!flashcardSetOpt.isPresent()) {
            throw new RuntimeException("FlashcardSet not found with id: " + id);
        }
        flashcardSetRepository.delete(flashcardSetOpt.get());
    }

    @Override
    public FlashcardSetDto getFlashcardSetById(Long id) {
        Optional<FlashcardSet> flashcardSetOpt = flashcardSetRepository.findById(id);
        if (!flashcardSetOpt.isPresent()) {
            throw new RuntimeException("FlashcardSet not found with id: " + id);
        }
        return convertToDto(flashcardSetOpt.get());
    }

    @Override
    public List<FlashcardSetDto> getFlashcardSetsByUser(Long userId) {
        // For now, return all sets (simplified implementation)
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findAll();
        return flashcardSets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> getAllFlashcardSets(int page, int size) {
        // Simplified implementation without pagination for now
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findAll();
        return flashcardSets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> searchFlashcardSets(String keyword, int page, int size) {
        // Simplified implementation without pagination
        List<FlashcardSet> flashcardSets = flashcardSetRepository.searchFlashcardSets(keyword);
        return flashcardSets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Flashcard operations
    @Override
    public FlashcardDto createFlashcard(FlashcardDto flashcardDto, Long setId, Long userId) {
        Flashcard flashcard = new Flashcard();
        flashcard.setFrontText(flashcardDto.getFrontText());
        flashcard.setBackText(flashcardDto.getBackText());
        
        // Find the flashcard set
        Optional<FlashcardSet> setOpt = flashcardSetRepository.findById(setId);
        if (setOpt.isPresent()) {
            flashcard.setFlashcardSet(setOpt.get());
        }
        
        flashcard.setCreatedAt(LocalDateTime.now());
        flashcard.setUpdatedAt(LocalDateTime.now());

        Flashcard savedFlashcard = flashcardRepository.save(flashcard);
        return convertFlashcardToDto(savedFlashcard);
    }

    @Override
    public FlashcardDto updateFlashcard(Long id, FlashcardDto flashcardDto, Long userId) {
        Optional<Flashcard> existingFlashcardOpt = flashcardRepository.findById(id);
        if (!existingFlashcardOpt.isPresent()) {
            throw new RuntimeException("Flashcard not found with id: " + id);
        }

        Flashcard existingFlashcard = existingFlashcardOpt.get();
        existingFlashcard.setFrontText(flashcardDto.getFrontText());
        existingFlashcard.setBackText(flashcardDto.getBackText());
        existingFlashcard.setUpdatedAt(LocalDateTime.now());

        Flashcard updatedFlashcard = flashcardRepository.save(existingFlashcard);
        return convertFlashcardToDto(updatedFlashcard);
    }

    @Override
    public void deleteFlashcard(Long id, Long userId) {
        Optional<Flashcard> flashcardOpt = flashcardRepository.findById(id);
        if (!flashcardOpt.isPresent()) {
            throw new RuntimeException("Flashcard not found with id: " + id);
        }
        flashcardRepository.delete(flashcardOpt.get());
    }

    @Override
    public FlashcardDto getFlashcardById(Long id) {
        Optional<Flashcard> flashcardOpt = flashcardRepository.findById(id);
        if (!flashcardOpt.isPresent()) {
            throw new RuntimeException("Flashcard not found with id: " + id);
        }
        return convertFlashcardToDto(flashcardOpt.get());
    }

    @Override
    public List<FlashcardDto> getFlashcardsBySet(Long setId) {
        List<Flashcard> flashcards = flashcardRepository.findByFlashcardSetId(setId);
        return flashcards.stream()
                .map(this::convertFlashcardToDto)
                .collect(Collectors.toList());
    }

    // Utility methods
    @Override
    public List<FlashcardSetDto> getRecentFlashcardSets(int limit) {
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findByIsPublicTrue();
        return flashcardSets.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardSetDto> getPopularFlashcardSets(int limit) {
        List<FlashcardSet> flashcardSets = flashcardSetRepository.findByIsPublicTrue();
        return flashcardSets.stream()
                .sorted((a, b) -> {
                    int viewA = a.getViewCount() != null ? a.getViewCount() : 0;
                    int viewB = b.getViewCount() != null ? b.getViewCount() : 0;
                    return Integer.compare(viewB, viewA);
                })
                .limit(limit)
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void incrementViewCount(Long setId) {
        Optional<FlashcardSet> flashcardSetOpt = flashcardSetRepository.findById(setId);
        if (flashcardSetOpt.isPresent()) {
            FlashcardSet flashcardSet = flashcardSetOpt.get();
            int currentViewCount = flashcardSet.getViewCount() != null ? flashcardSet.getViewCount() : 0;
            flashcardSet.setViewCount(currentViewCount + 1);
            flashcardSetRepository.save(flashcardSet);
        }
    }

    // Helper methods
    private FlashcardSetDto convertToDto(FlashcardSet flashcardSet) {
        FlashcardSetDto dto = new FlashcardSetDto();
        dto.setId(flashcardSet.getId());
        dto.setTitle(flashcardSet.getTitle());
        dto.setDescription(flashcardSet.getDescription());
        dto.setCategory(flashcardSet.getCategory());
        dto.setDifficultyLevel(flashcardSet.getDifficultyLevel());
        dto.setIsPublic(flashcardSet.getIsPublic());
        dto.setCreatedAt(flashcardSet.getCreatedAt());
        dto.setUpdatedAt(flashcardSet.getUpdatedAt());
        return dto;
    }

    private FlashcardDto convertFlashcardToDto(Flashcard flashcard) {
        FlashcardDto dto = new FlashcardDto();
        dto.setId(flashcard.getId());
        dto.setFrontText(flashcard.getFrontText());
        dto.setBackText(flashcard.getBackText());
        dto.setCreatedAt(flashcard.getCreatedAt());
        dto.setUpdatedAt(flashcard.getUpdatedAt());
        if (flashcard.getFlashcardSet() != null) {
            dto.setFlashcardSetId(flashcard.getFlashcardSet().getId());
        }
        return dto;
    }
}
