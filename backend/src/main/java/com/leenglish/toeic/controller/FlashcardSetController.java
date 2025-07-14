package com.leenglish.toeic.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.leenglish.toeic.domain.Flashcard;
import com.leenglish.toeic.domain.FlashcardSet;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.ApiResponse;
import com.leenglish.toeic.dto.FlashcardSetCreateRequest;
import com.leenglish.toeic.dto.FlashcardSetUpdateRequest;
import com.leenglish.toeic.service.FlashcardSetService;
import com.leenglish.toeic.service.UserService;
import com.leenglish.toeic.dto.FlashcardSetDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/flashcard-sets")
public class FlashcardSetController {

    @Autowired
    private FlashcardSetService flashcardSetService;

    @Autowired
    private UserService userService;

    // Featured sets
    @GetMapping("/public/featured")
    public ResponseEntity<List<FlashcardSetDto>> getFeaturedPublicSets(@RequestParam(defaultValue = "4") int limit) {
        List<FlashcardSetDto> sets = flashcardSetService.getFeaturedPublicSets(limit);
        return ResponseEntity.ok(sets);
    }

    // All public sets
    @GetMapping("/public")
    public ResponseEntity<List<FlashcardSetDto>> getPublicSets() {
        List<FlashcardSetDto> sets = flashcardSetService.getPublicSets();
        return ResponseEntity.ok(sets);
    }

    // Lấy bộ flashcard theo ID (có kiểm tra quyền truy cập)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashcardSet>> getSetById(@PathVariable Long id, Authentication auth) {
        try {
            FlashcardSet set = flashcardSetService.getSetById(id);
            if (set == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Flashcard set not found", null));
            }

            // Kiểm tra quyền truy cập
            if (auth != null) {
                String username = auth.getName();
                User user = userService.findByUsername(username).orElse(null);
                if (user != null && !flashcardSetService.canUserAccessSet(user, set)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiResponse<>(false, "Access denied to this flashcard set", null));
                }
            } else {
                if (!set.getIsPublic() || set.getIsPremium()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiResponse<>(false, "Access denied. Login required for this content.", null));
                }
            }

            flashcardSetService.incrementViewCount(id);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Flashcard set retrieved successfully",
                    set));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to retrieve flashcard set: " + e.getMessage(), null));
        }
    }

    // Lấy danh sách flashcard trong 1 bộ
    @GetMapping("/{id}/flashcards")
    public ResponseEntity<ApiResponse<List<Flashcard>>> getFlashcards(@PathVariable Long id, Authentication auth) {
        try {
            FlashcardSet set = flashcardSetService.getSetById(id);
            if (set == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Flashcard set not found", null));
            }

            if (auth != null) {
                String username = auth.getName();
                User user = userService.findByUsername(username).orElse(null);
                if (user != null && !flashcardSetService.canUserAccessSet(user, set)) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiResponse<>(false, "Access denied to flashcards in this set", null));
                }
            } else {
                if (!set.getIsPublic() || set.getIsPremium()) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(new ApiResponse<>(false, "Access denied. Login required for this content.", null));
                }
            }

            List<Flashcard> flashcards = flashcardSetService.getFlashcardsBySetId(id);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Flashcards retrieved successfully",
                    flashcards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to retrieve flashcards: " + e.getMessage(), null));
        }
    }

    // Tạo bộ flashcard mới (chỉ cộng tác viên/admin)
    @PostMapping
    public ResponseEntity<ApiResponse<FlashcardSet>> createSet(
            @Valid @RequestBody FlashcardSetCreateRequest request,
            Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication required", null));
        }

        try {
            String username = auth.getName();
            User user = userService.findByUsername(username).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "User not found", null));
            }

            if (!user.getRole().name().equals("COLLABORATOR") && !user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "Insufficient permissions to create flashcard sets", null));
            }

            FlashcardSet createdSet = flashcardSetService.createSet(request, user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(
                            true,
                            "Flashcard set created successfully",
                            createdSet));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to create flashcard set: " + e.getMessage(), null));
        }
    }

    // Cập nhật bộ flashcard (chỉ chủ sở hữu/cộng tác viên/admin)

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FlashcardSet>> updateSet(
            @PathVariable Long id,
            @Valid @RequestBody FlashcardSetUpdateRequest request,
            Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication required", null));
        }

        try {
            String username = auth.getName();
            User user = userService.findByUsername(username).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "User not found", null));
            }

            FlashcardSet existingSet = flashcardSetService.getSetById(id);
            if (existingSet == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Flashcard set not found", null));
            }

            if (!flashcardSetService.canUserModifySet(user, existingSet)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "Insufficient permissions to update this flashcard set", null));
            }

            FlashcardSet updatedSet = flashcardSetService.updateSet(id, request, user);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Flashcard set updated successfully",
                    updatedSet));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update flashcard set: " + e.getMessage(), null));
        }
    }

    // Xóa bộ flashcard (chỉ admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSet(@PathVariable Long id, Authentication auth) {
        if (auth == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse<>(false, "Authentication required", null));
        }

        try {
            String username = auth.getName();
            User user = userService.findByUsername(username).orElse(null);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse<>(false, "User not found", null));
            }

            if (!user.getRole().name().equals("ADMIN")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ApiResponse<>(false, "Only administrators can delete flashcard sets", null));
            }

            FlashcardSet existingSet = flashcardSetService.getSetById(id);
            if (existingSet == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Flashcard set not found", null));
            }

            flashcardSetService.deleteSet(id);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Flashcard set deleted successfully",
                    null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to delete flashcard set: " + e.getMessage(), null));
        }
    }

    // Tăng view count cho bộ flashcard
    @PostMapping("/{id}/view")
    public ResponseEntity<ApiResponse<Void>> trackView(@PathVariable Long id) {
        try {
            FlashcardSet set = flashcardSetService.getSetById(id);
            if (set == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "Flashcard set not found", null));
            }

            flashcardSetService.incrementViewCount(id);

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "View count updated successfully",
                    null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to update view count: " + e.getMessage(), null));
        }
    }

    // Lấy tất cả bộ flashcard (cho người dùng đã đăng nhập)
    @GetMapping
    public ResponseEntity<ApiResponse<List<FlashcardSetDto>>> getAllSets(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication auth) {

        try {
            System.out.println(
                    "🎯 GET /api/flashcard-sets called with auth: " + (auth != null ? auth.getName() : "anonymous"));

            Sort sort = sortDir.equals("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
            Pageable pageable = PageRequest.of(page, size, sort);

            // For authenticated users, get all accessible sets (public + premium if
            // allowed)
            Page<FlashcardSet> setsPage;
            if (auth != null) {
                String username = auth.getName();
                User user = userService.findByUsername(username).orElse(null);
                if (user != null) {
                    System.out.println("✅ Getting sets for authenticated user: " + username);
                    // Get sets based on user's access level - fallback to public sets for now
                    setsPage = flashcardSetService.getPublicSets(difficulty, category, search, pageable);
                } else {
                    System.out.println("⚠️ User not found, falling back to public sets");
                    setsPage = flashcardSetService.getPublicSets(difficulty, category, search, pageable);
                }
            } else {
                System.out.println("ℹ️ Anonymous user, returning public sets");
                setsPage = flashcardSetService.getPublicSets(difficulty, category, search, pageable);
            }

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("totalElements", setsPage.getTotalElements());
            metadata.put("totalPages", setsPage.getTotalPages());
            metadata.put("currentPage", page);

            System.out.println("✅ Returning " + setsPage.getContent().size() + " flashcard sets");

            // Convert to DTOs to avoid lazy loading issues
            List<FlashcardSetDto> setDtos = setsPage.getContent().stream()
                    .map(flashcardSetService::mapToDto)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Flashcard sets retrieved successfully",
                    setDtos,
                    metadata));
        } catch (Exception e) {
            System.err.println("❌ Error in getAllSets: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to retrieve flashcard sets: " + e.getMessage(),
                            null));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Flashcard Sets API is working! " + java.time.LocalDateTime.now());
    }
}
