package com.leenglish.toeic.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.dto.FlashcardDto;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.service.FlashcardService;
import com.leenglish.toeic.service.FlashcardSetService;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @Autowired
    private FlashcardSetService flashcardSetService;

    // Flashcard Set endpoints
    @GetMapping("/sets")
    public ResponseEntity<List<FlashcardSetDto>> getPublicFlashcardSets() {
        List<FlashcardSetDto> sets = flashcardSetService.getPublicFlashcardSets();
        return ResponseEntity.ok(sets);
    }

    // Free flashcard sets for non-premium users (limited access)
    @GetMapping("/free")
    public ResponseEntity<List<FlashcardSetDto>> getFreeFlashcardSets() {
        List<FlashcardSetDto> sets = flashcardSetService.getFreeFlashcardSetsForBasicUsers();
        return ResponseEntity.ok(sets);
    }

    @GetMapping("/sets/my")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<FlashcardSetDto>> getMyFlashcardSets(Authentication authentication) {
        // Thay vì hardcode userId = 1L, sử dụng phương thức đã định nghĩa
        Long userId = extractUserIdFromAuth(authentication);
        List<FlashcardSetDto> sets = flashcardSetService.getFlashcardSetsByUser(userId);
        return ResponseEntity.ok(sets);
    }

    @GetMapping("/sets/accessible")
    @PreAuthorize("hasRole('USER') or hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<FlashcardSetDto>> getAccessibleFlashcardSets(Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        List<FlashcardSetDto> sets = flashcardSetService.getAccessibleFlashcardSets(userId);
        return ResponseEntity.ok(sets);
    }

    @PostMapping("/sets")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<FlashcardSetDto> createFlashcardSet(@RequestBody FlashcardSetDto setDto,
            Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        FlashcardSetDto createdSet = flashcardSetService.createFlashcardSet(setDto, userId);
        return ResponseEntity.ok(createdSet);
    }

    @PutMapping("/sets/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<FlashcardSetDto> updateFlashcardSet(@PathVariable Long id,
            @RequestBody FlashcardSetDto setDto) {
        FlashcardSetDto updatedSet = flashcardSetService.updateFlashcardSet(id, setDto);
        return ResponseEntity.ok(updatedSet);
    }

    @DeleteMapping("/sets/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFlashcardSet(@PathVariable Long id) {
        flashcardSetService.deleteFlashcardSet(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sets/search")
    public ResponseEntity<List<FlashcardSetDto>> searchFlashcardSets(@RequestParam String query,
            Authentication authentication) {
        // Extract user ID from authentication
        Long userId = 1L; // This should be extracted from the authenticated user
        List<FlashcardSetDto> sets = flashcardSetService.searchFlashcardSets(query, userId);
        return ResponseEntity.ok(sets);
    }

    // Individual Flashcard endpoints
    @GetMapping("/set/{setId}")
    public ResponseEntity<List<FlashcardDto>> getFlashcardsBySet(@PathVariable Long setId) {
        List<FlashcardDto> flashcards = flashcardService.getFlashcardsBySet(setId);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<FlashcardDto>> getFlashcardsByLevel(@PathVariable String level) {
        List<FlashcardDto> flashcards = flashcardService.getFlashcardsByLevel(level);
        return ResponseEntity.ok(flashcards);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<FlashcardDto>> getFlashcardsByCategory(@PathVariable String category) {
        List<FlashcardDto> flashcards = flashcardService.getFlashcardsByCategory(category);
        return ResponseEntity.ok(flashcards);
    }

    @PostMapping
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<FlashcardDto> createFlashcard(@RequestBody FlashcardDto flashcardDto) {
        FlashcardDto createdFlashcard = flashcardService.createFlashcard(flashcardDto);
        return ResponseEntity.ok(createdFlashcard);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COLLABORATOR') or hasRole('ADMIN')")
    public ResponseEntity<FlashcardDto> updateFlashcard(@PathVariable Long id, @RequestBody FlashcardDto flashcardDto) {
        FlashcardDto updatedFlashcard = flashcardService.updateFlashcard(id, flashcardDto);
        return ResponseEntity.ok(updatedFlashcard);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFlashcard(@PathVariable Long id) {
        flashcardService.deleteFlashcard(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<FlashcardDto>> searchFlashcards(@RequestParam String query) {
        List<FlashcardDto> flashcards = flashcardService.searchFlashcards(query);
        return ResponseEntity.ok(flashcards);
    }

    // Lấy flashcard set (bao gồm flashcards) cho user đã đăng nhập
    @GetMapping("/sets/{id}")
    public ResponseEntity<FlashcardSetDto> getFlashcardSetById(@PathVariable Long id, Authentication authentication) {
        FlashcardSetDto set = flashcardSetService.getFlashcardSetWithFlashcardsById(id, authentication);
        if (set == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(set);
    }

    // Lấy flashcard set free (bao gồm flashcards) cho guest
    @GetMapping("/free/{id}")
    public ResponseEntity<FlashcardSetDto> getFreeFlashcardSetById(@PathVariable Long id) {
        FlashcardSetDto set = flashcardSetService.getFreeFlashcardSetById(id);
        if (set == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(set);
    }

    private Long extractUserIdFromAuth(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return 1L; // Default fallback
        }

        try {
            // Try to parse username as ID first
            return Long.parseLong(authentication.getName());
        } catch (NumberFormatException e) {
            // If username is not a number, you might need to lookup user by username
            // For now, return default
            return 1L;
        }
    }

    @GetMapping("/sets/all")
    public ResponseEntity<List<FlashcardSetDto>> getAllFlashcardSets() {
        try {
            List<FlashcardSetDto> flashcardSets = flashcardSetService.getAllFlashcardSets();
            System.out.println("📚 Returning " + flashcardSets.size() + " flashcard sets");
            return ResponseEntity.ok(flashcardSets);
        } catch (Exception e) {
            System.err.println("❌ Error fetching flashcard sets: " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // Get flashcards by set ID
    @GetMapping("/sets/{id}/flashcards")
    public ResponseEntity<List<FlashcardDto>> getFlashcardsBySetId(@PathVariable Long id) {
        try {
            List<com.leenglish.toeic.domain.Flashcard> flashcards = flashcardSetService.getFlashcardsBySetId(id);
            List<FlashcardDto> flashcardDtos = flashcards.stream()
                    .map(this::convertToDto)
                    .collect(java.util.stream.Collectors.toList());
            System.out.println("📚 Returning " + flashcardDtos.size() + " flashcards for set " + id);
            return ResponseEntity.ok(flashcardDtos);
        } catch (Exception e) {
            System.err.println("❌ Error fetching flashcards for set " + id + ": " + e.getMessage());
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    // Convert Flashcard entity to DTO
    private FlashcardDto convertToDto(com.leenglish.toeic.domain.Flashcard flashcard) {
        FlashcardDto dto = new FlashcardDto();
        dto.setId(flashcard.getId());
        dto.setTerm(flashcard.getFrontText());
        dto.setDefinition(flashcard.getBackText());
        dto.setExample(flashcard.getExample());
        dto.setAudioUrl(flashcard.getAudioUrl());
        dto.setImageUrl(flashcard.getImageUrl());
        dto.setLevel(flashcard.getDifficultyLevel() != null ? flashcard.getDifficultyLevel().toString() : "BEGINNER");
        dto.setCategory(flashcard.getCategory());
        dto.setIsActive(flashcard.getIsActive());
        dto.setFlashcardSetId(flashcard.getFlashcardSet() != null ? flashcard.getFlashcardSet().getId() : null);
        dto.setCreatedAt(flashcard.getCreatedAt());
        dto.setUpdatedAt(flashcard.getUpdatedAt());
        return dto;
    }

}
