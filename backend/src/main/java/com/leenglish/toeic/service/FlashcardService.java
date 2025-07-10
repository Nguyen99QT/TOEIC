package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.Flashcard;
import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.repository.FlashcardRepository;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    public List<FlashcardDto> getFlashcardsBySet(Long flashcardSetId) {
        List<Flashcard> flashcards = flashcardRepository.findByFlashcardSetIdAndIsActiveTrue(flashcardSetId);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FlashcardDto> getFlashcardsByLevel(String level) {
        List<Flashcard> flashcards = flashcardRepository.findByLevelAndIsActiveTrue(level);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<FlashcardDto> getFlashcardsByCategory(String category) {
        List<Flashcard> flashcards = flashcardRepository.findByCategoryAndIsActiveTrue(category);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public FlashcardDto createFlashcard(FlashcardDto flashcardDto) {
        Optional<FlashcardSet> flashcardSetOpt = flashcardSetRepository.findById(flashcardDto.getFlashcardSetId());
        if (!flashcardSetOpt.isPresent()) {
            throw new RuntimeException("FlashcardSet not found with id: " + flashcardDto.getFlashcardSetId());
        }

        Flashcard flashcard = new Flashcard();
        flashcard.setTerm(flashcardDto.getTerm());
        flashcard.setDefinition(flashcardDto.getDefinition());
        flashcard.setExample(flashcardDto.getExample());
        flashcard.setAudioUrl(flashcardDto.getAudioUrl());
        flashcard.setImageUrl(flashcardDto.getImageUrl());
        flashcard.setLevel(flashcardDto.getLevel());
        flashcard.setCategory(flashcardDto.getCategory());
        flashcard.setIsActive(true);
        flashcard.setCreatedAt(LocalDateTime.now());
        flashcard.setUpdatedAt(LocalDateTime.now());
        flashcard.setFlashcardSet(flashcardSetOpt.get());

        Flashcard savedFlashcard = flashcardRepository.save(flashcard);
        return convertToDto(savedFlashcard);
    }

    public FlashcardDto updateFlashcard(Long id, FlashcardDto flashcardDto) {
        Optional<Flashcard> flashcardOpt = flashcardRepository.findById(id);
        if (!flashcardOpt.isPresent()) {
            throw new RuntimeException("Flashcard not found with id: " + id);
        }

        Flashcard flashcard = flashcardOpt.get();
        flashcard.setTerm(flashcardDto.getTerm());
        flashcard.setDefinition(flashcardDto.getDefinition());
        flashcard.setExample(flashcardDto.getExample());
        flashcard.setAudioUrl(flashcardDto.getAudioUrl());
        flashcard.setImageUrl(flashcardDto.getImageUrl());
        flashcard.setLevel(flashcardDto.getLevel());
        flashcard.setCategory(flashcardDto.getCategory());
        flashcard.setUpdatedAt(LocalDateTime.now());

        Flashcard updatedFlashcard = flashcardRepository.save(flashcard);
        return convertToDto(updatedFlashcard);
    }

    public void deleteFlashcard(Long id) {
        Optional<Flashcard> flashcardOpt = flashcardRepository.findById(id);
        if (!flashcardOpt.isPresent()) {
            throw new RuntimeException("Flashcard not found with id: " + id);
        }

        Flashcard flashcard = flashcardOpt.get();
        flashcard.setIsActive(false);
        flashcard.setUpdatedAt(LocalDateTime.now());
        flashcardRepository.save(flashcard);
    }

    public List<FlashcardDto> searchFlashcards(String searchTerm) {
        List<Flashcard> flashcards = flashcardRepository.searchFlashcards(searchTerm);
        return flashcards.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private FlashcardDto convertToDto(Flashcard flashcard) {
        return new FlashcardDto(
                flashcard.getId(),
                flashcard.getTerm(),
                flashcard.getDefinition(),
                flashcard.getExample(),
                flashcard.getAudioUrl(),
                flashcard.getImageUrl(),
                flashcard.getLevel(),
                flashcard.getCategory(),
                flashcard.getIsActive(),
                flashcard.getCreatedAt(),
                flashcard.getUpdatedAt(),
                flashcard.getFlashcardSet() != null ? flashcard.getFlashcardSet().getId() : null);
    }
}
