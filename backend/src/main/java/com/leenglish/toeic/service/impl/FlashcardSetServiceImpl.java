package com.leenglish.toeic.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.FlashcardSetCreateRequest;
import com.leenglish.toeic.dto.FlashcardSetDto;
import com.leenglish.toeic.repository.FlashcardSetRepository;
import com.leenglish.toeic.repository.FlashcardRepository; // Add this import
import com.leenglish.toeic.service.FlashcardService;
import com.leenglish.toeic.service.FlashcardSetService;

@Service
public class FlashcardSetServiceImpl implements FlashcardSetService {

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardService flashcardService;

    // ⚡ ADD THIS: Inject FlashcardRepository dependency
    @Autowired
    private FlashcardRepository flashcardRepository;

    @Override
    @Transactional(readOnly = true)
    public FlashcardSetDto mapToDto(FlashcardSet set) {
        // ✅ COMPLETE THIS METHOD - Ensure FlashcardSetDto has all required fields
        FlashcardSetDto dto = new FlashcardSetDto();
        dto.setId(set.getId());
        dto.setName(set.getName());
        dto.setTitle(set.getTitle());
        dto.setDescription(set.getDescription());
        dto.setIsPublic(set.getIsPublic());
        dto.setIsActive(set.getIsActive());
        dto.setIsPremium(set.getIsPremium());
        dto.setEstimatedTimeMinutes(set.getEstimatedTimeMinutes());
        dto.setCreatedAt(set.getCreatedAt());
        dto.setUpdatedAt(set.getUpdatedAt());

        // ⚡ FIX: Use repository query instead of accessing lazy collection
        try {
            Long cardCount = flashcardRepository.countActiveFlashcardsBySetId(set.getId());
            dto.setCardCount(cardCount != null ? cardCount.intValue() : 0);
            dto.setFlashcardCount(cardCount != null ? cardCount.intValue() : 0); // For compatibility
        } catch (Exception e) {
            System.out.println("⚠️ Warning: Could not count cards for set " + set.getId() + ": " + e.getMessage());
            dto.setCardCount(0);
            dto.setFlashcardCount(0);
        }

        return dto;
    }

    @Override
    public FlashcardSetDto getFlashcardSetWithFlashcardsById(Long id, Authentication authentication) {
        Optional<FlashcardSet> setOpt = flashcardSetRepository.findById(id);
        if (setOpt.isPresent()) {
            FlashcardSet set = setOpt.get();
            FlashcardSetDto dto = mapToDto(set);
            dto.setFlashcards(flashcardService.getFlashcardsBySet(id));
            return dto;
        }
        return null;
    }

    @Override
    public FlashcardSetDto getFreeFlashcardSetById(Long id) {
        Optional<FlashcardSet> setOpt = flashcardSetRepository
                .findByIdAndIsPublicTrueAndIsPremiumFalseAndIsActiveTrue(id);
        if (setOpt.isPresent()) {
            FlashcardSet set = setOpt.get();
            FlashcardSetDto dto = mapToDto(set);
            dto.setFlashcards(flashcardService.getFlashcardsBySet(id));
            return dto;
        }
        return null;
    }

    @Override
    public FlashcardSet getSetById(Long id) {
        try {
            Optional<FlashcardSet> setOpt = flashcardSetRepository.findById(id);
            if (setOpt.isPresent()) {
                System.out.println("✅ Found flashcard set with id: " + id);
                return setOpt.get();
            } else {
                System.out.println("❌ Flashcard set not found with id: " + id);
                return null;
            }
        } catch (Exception e) {
            System.err.println("❌ Error getting flashcard set by id " + id + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<FlashcardSetDto> getFlashcardSetsByUser(Long userId) {
        return null;
    }

    @Override
    public void deleteSet(Long id) {
        // TODO: implement
    }

    @Override
    public Page<FlashcardSet> getPublicSets(String difficulty, String category, String search, Pageable pageable) {
        try {
            System.out.println("🔄 Getting public flashcard sets with filters - difficulty: " + difficulty
                    + ", category: " + category + ", search: " + search);

            // For now, get all public and active sets
            Page<FlashcardSet> setsPage = flashcardSetRepository.findByIsPublicTrueAndIsActiveTrue(pageable);

            System.out.println("✅ Found " + setsPage.getContent().size() + " public flashcard sets");
            return setsPage;
        } catch (Exception e) {
            System.err.println("❌ Error getting public flashcard sets: " + e.getMessage());
            e.printStackTrace();
            return Page.empty();
        }
    }

    @Override
    public List<FlashcardSetDto> getPublicFlashcardSets() {
        try {
            System.out.println("🔄 Getting all public flashcard sets");
            List<FlashcardSet> publicSets = flashcardSetRepository.findByIsPublicTrueAndIsActiveTrue();

            List<FlashcardSetDto> result = publicSets.stream()
                    .map(this::mapToDto)
                    .collect(java.util.stream.Collectors.toList());

            System.out.println("✅ Found " + result.size() + " public flashcard sets");
            return result;
        } catch (Exception e) {
            System.err.println("❌ Error getting public flashcard sets: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public boolean canUserAccessSet(User user, FlashcardSet set) {
        try {
            if (set == null)
                return false;

            // Public sets are accessible to everyone
            if (set.getIsPublic() && !set.getIsPremium()) {
                return true;
            }

            // If user is null (not authenticated), only public non-premium sets
            if (user == null) {
                return set.getIsPublic() && !set.getIsPremium();
            }

            // Admin and collaborators can access everything
            if ("ADMIN".equals(user.getRole().name()) || "COLLABORATOR".equals(user.getRole().name())) {
                return true;
            }

            // Premium users can access premium content
            if ("PREMIUM".equals(user.getRole().name()) && set.getIsPublic()) {
                return true;
            }

            // Regular users can access public non-premium content
            if ("USER".equals(user.getRole().name()) && set.getIsPublic() && !set.getIsPremium()) {
                return true;
            }

            return false;
        } catch (Exception e) {
            System.err.println("❌ Error checking user access to set: " + e.getMessage());
            return false;
        }
    }

    @Override
    public List<FlashcardSetDto> searchFlashcardSets(String query, Long userId) {
        return null;
    }

    @Override
    public List<FlashcardSetDto> getAccessibleFlashcardSets(Long userId) {
        return null;
    }

    @Override
    public boolean canUserModifySet(User user, FlashcardSet set) {
        return false;
    }

    @Override
    public FlashcardSet createSet(FlashcardSetCreateRequest request, User user) {
        // TODO: Add logic to create a new FlashcardSet from request and user if needed
        return null;
    }

    @Override
    public FlashcardSetDto updateFlashcardSet(Long id, FlashcardSetDto setDto) {
        // TODO: Implement logic to update FlashcardSet
        return null;
    }

    @Override
    public List<FlashcardSetDto> getFreeFlashcardSetsForBasicUsers() {
        // TODO: Implement logic to fetch free flashcard sets for basic users
        return null;
    }

    @Override
    public FlashcardSetDto createFlashcardSet(FlashcardSetDto setDto, Long userId) {
        // TODO: Implement logic to create a new FlashcardSet from DTO and userId
        return null;
    }

    @Override
    public void deleteFlashcardSet(Long id) {
        // TODO: Implement logic to delete FlashcardSet
    }

    @Override
    public void incrementViewCount(Long id) {
        try {
            Optional<FlashcardSet> setOpt = flashcardSetRepository.findById(id);
            if (setOpt.isPresent()) {
                FlashcardSet set = setOpt.get();
                Integer currentViews = set.getViewCount() != null ? set.getViewCount() : 0;
                set.setViewCount(currentViews + 1);
                flashcardSetRepository.save(set);
                System.out.println("✅ Incremented view count for set " + id + " to " + (currentViews + 1));
            }
        } catch (Exception e) {
            System.err.println("❌ Error incrementing view count for set " + id + ": " + e.getMessage());
        }
    }

    @Override
    public List<com.leenglish.toeic.domain.Flashcard> getFlashcardsBySetId(Long id) {
        try {
            // Use the method with EntityGraph to fetch flashcards eagerly
            Optional<FlashcardSet> setOpt = flashcardSetRepository.findWithFlashcardsById(id);
            if (!setOpt.isPresent()) {
                System.err.println("❌ Flashcard set not found with id: " + id);
                return new java.util.ArrayList<>();
            }

            FlashcardSet set = setOpt.get();
            System.out.println("📚 Found flashcard set: " + set.getName());

            // Get flashcards from the set
            List<com.leenglish.toeic.domain.Flashcard> flashcards = new java.util.ArrayList<>();
            if (set.getFlashcards() != null) {
                flashcards = new java.util.ArrayList<>(set.getFlashcards());
                // Sort by order index if available
                flashcards.sort((f1, f2) -> {
                    Integer order1 = f1.getOrderIndex() != null ? f1.getOrderIndex() : 0;
                    Integer order2 = f2.getOrderIndex() != null ? f2.getOrderIndex() : 0;
                    return order1.compareTo(order2);
                });
            }

            System.out.println("📚 Found " + flashcards.size() + " flashcards for set " + id);
            return flashcards;
        } catch (Exception e) {
            System.err.println("❌ Error getting flashcards for set " + id + ": " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public FlashcardSet updateSet(Long id, com.leenglish.toeic.dto.FlashcardSetUpdateRequest request, User user) {
        // TODO: Implement logic to update FlashcardSet from request and user
        return null;
    }

    @Override
    public List<FlashcardSetDto> getAllFlashcardSets() {
        try {
            List<FlashcardSet> flashcardSets = flashcardSetRepository.findAll();
            System.out.println("📚 Found " + flashcardSets.size() + " flashcard sets in database");

            return flashcardSets.stream()
                    .map(this::mapToDto)
                    .collect(java.util.stream.Collectors.toList());
        } catch (Exception e) {
            System.err.println("❌ Database error in getAllFlashcardSets: " + e.getMessage());
            e.printStackTrace();
            return new java.util.ArrayList<>();
        }
    }

    @Override
    public Page<FlashcardSet> getAccessibleSets(User user, String difficulty, String category, String search,
            Pageable pageable) {
        // TODO: Implement logic to fetch accessible sets for the user based on filters
        return Page.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashcardSetDto> getFeaturedPublicSets(int limit) {
        try {
            System.out.println("🔄 Getting featured public flashcard sets with limit: " + limit);

            // Use the corrected repository method
            List<FlashcardSet> sets = flashcardSetRepository.findPublicAndActiveFlashcardSets();
            System.out.println("✅ Found " + sets.size() + " public flashcard sets");

            return sets.stream()
                    .limit(limit)
                    .map(this::mapToDto) // ⚡ USE THE MAPPING METHOD
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("❌ Error getting featured public flashcard sets: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashcardSetDto> getPublicSets() {
        try {
            System.out.println("🔄 Getting all public flashcard sets");

            // Use the corrected repository method
            List<FlashcardSet> sets = flashcardSetRepository.findPublicAndActiveFlashcardSets();
            System.out.println("✅ Found " + sets.size() + " public flashcard sets");

            return sets.stream()
                    .map(this::mapToDto) // ⚡ USE THE MAPPING METHOD
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.out.println("❌ Error getting public flashcard sets: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }
}
