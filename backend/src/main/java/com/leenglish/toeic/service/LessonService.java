package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.dto.LessonDto;
import com.leenglish.toeic.repository.ExerciseRepository;
import com.leenglish.toeic.repository.LessonRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ExerciseRepository exerciseRepository;

    @Autowired
    public LessonService(LessonRepository lessonRepository, ExerciseRepository exerciseRepository) {
        this.lessonRepository = lessonRepository;
        this.exerciseRepository = exerciseRepository;
    }

    // Basic CRUD operations
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    public Lesson saveLesson(Lesson lesson) {
        if (lesson.getId() == null) {
            lesson.setCreatedAt(LocalDateTime.now());
        }
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    public Lesson createLesson(Lesson lesson) {
        lesson.setId(null); // Ensure it's a new lesson
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        lesson.setIsActive(true);

        // Set defaults if not provided
        if (lesson.getIsActive() == null) {
            lesson.setIsActive(true);
        }
        if (lesson.getIsPremium() == null) {
            lesson.setIsPremium(false);
        }
        if (lesson.getOrderIndex() == null) {
            lesson.setOrderIndex(0);
        }

        // Just save the lesson without calling updateLesson
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson lessonUpdate) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        // Update fields
        lesson.setTitle(lessonUpdate.getTitle());
        lesson.setDescription(lessonUpdate.getDescription());
        lesson.setContent(lessonUpdate.getContent());
        lesson.setLevel(lessonUpdate.getLevel());
        lesson.setImageUrl(lessonUpdate.getImageUrl());
        lesson.setAudioUrl(lessonUpdate.getAudioUrl());
        lesson.setIsPremium(lessonUpdate.getIsPremium());
        lesson.setIsActive(lessonUpdate.getIsActive());
        lesson.setOrderIndex(lessonUpdate.getOrderIndex());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    public boolean deleteLesson(Long id) {
        if (lessonRepository.existsById(id)) {
            lessonRepository.deleteById(id);
            return true;
        }
        return false;
    } // Query methods - using simple fallbacks for now

    public List<Lesson> getLessonsByLevel(String level) {
        // Fallback: filter all lessons by level in service layer
        return lessonRepository.findAll().stream()
                .filter(lesson -> level.equals(lesson.getLevel()) && Boolean.TRUE.equals(lesson.getIsActive()))
                .collect(Collectors.toList());
    }

    public List<Lesson> getActiveLessons() {
        // Fallback: filter all lessons by active status and sort by order index
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .sorted(Comparator.comparing(lesson -> lesson.getOrderIndex() != null ? lesson.getOrderIndex() : 0))
                .collect(Collectors.toList());
    }

    public List<Lesson> getPremiumLessons() {
        // Fallback: filter all lessons by premium and active status
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsPremium())
                        && Boolean.TRUE.equals(lesson.getIsActive()))
                .collect(Collectors.toList());
    }

    public List<Lesson> getFreeLessons() {
        // Fallback: filter all lessons by non-premium and active status
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.FALSE.equals(lesson.getIsPremium())
                        && Boolean.TRUE.equals(lesson.getIsActive()))
                .collect(Collectors.toList());
    }

    public List<Lesson> searchLessons(String keyword) {
        // Fallback: filter all lessons by keyword in title or description
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()) &&
                        (lesson.getTitle() != null && lesson.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                                lesson.getDescription() != null
                                        && lesson.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }

    // Replace the searchLessonsByTitle method
    public List<LessonDto> searchLessonsByTitle(String title) {
        return lessonRepository.findAll().stream()
                .filter(lesson -> lesson.getTitle() != null
                        && lesson.getTitle().toLowerCase().contains(title.toLowerCase()))
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<Lesson> getLessonsWithAudio() {
        // Fallback: filter lessons that have audio URL
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()) &&
                        lesson.getAudioUrl() != null && !lesson.getAudioUrl().trim().isEmpty())
                .collect(Collectors.toList());
    }

    public List<Lesson> getLessonsWithImages() {
        // Fallback: filter lessons that have image URL
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()) &&
                        lesson.getImageUrl() != null && !lesson.getImageUrl().trim().isEmpty())
                .collect(Collectors.toList());
    }

    public List<Lesson> getRandomLessons(String level, int limit) {
        // Fallback: get lessons by level and limit the results
        return getLessonsByLevel(level).stream()
                .limit(limit)
                .collect(Collectors.toList());
    }

    public List<Lesson> getLessonsOrderByCreatedDate() {
        // Fallback: sort all active lessons by created date descending
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .sorted(Comparator.comparing(Lesson::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    public List<Lesson> getLessonsOrderByUpdatedDate() {
        // Fallback: sort all active lessons by updated date descending
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .sorted(Comparator.comparing(Lesson::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
    }

    // Advanced search
    public List<Lesson> findByCriteria(String level, Boolean isActive, Boolean isPremium) {
        // Fallback: filter all lessons by criteria
        return lessonRepository.findAll().stream()
                .filter(lesson -> (level == null || level.equals(lesson.getLevel())) &&
                        (isActive == null || isActive.equals(lesson.getIsActive())) &&
                        (isPremium == null || isPremium.equals(lesson.getIsPremium())))
                .collect(Collectors.toList());
    }

    // Statistics
    public Long countByLevel(String level) {
        // Fallback: count lessons by level in service layer
        return lessonRepository.findAll().stream()
                .filter(lesson -> level.equals(lesson.getLevel()))
                .count();
    }

    public long getTotalLessonCount() {
        return lessonRepository.count();
    }

    // Status management
    public Lesson activateLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        lesson.setIsActive(true);
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    public Lesson deactivateLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        lesson.setIsActive(false);
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    public Lesson setPremium(Long id, boolean isPremium) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Lesson not found"));

        lesson.setIsPremium(isPremium);
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    // Validation
    public boolean validateLesson(Lesson lesson) {
        return lesson.isValid();
    } // DTO methods for controllers

    public List<LessonDto> getAllActiveLessons() {
        List<Lesson> lessons = lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .sorted(Comparator.comparing(Lesson::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .collect(Collectors.toList());
        return lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public LessonDto getLessonDtoById(Long id) {
        Optional<Lesson> lesson = lessonRepository.findById(id);
        return lesson.map(this::convertToDto).orElse(null);
    }

    public List<LessonDto> getLessonsByType(String type) {
        List<Lesson> lessons = lessonRepository.findAll().stream()
                .filter(lesson -> type.equals(lesson.getType()) && Boolean.TRUE.equals(lesson.getIsActive()))
                .collect(Collectors.toList());
        return lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<LessonDto> getLessonsByDifficulty(String difficulty) {
        List<Lesson> lessons = lessonRepository.findAll().stream()
                .filter(lesson -> difficulty.equals(lesson.getDifficulty())
                        && Boolean.TRUE.equals(lesson.getIsActive()))
                .collect(Collectors.toList());
        return lessons.stream()
                .map(this::convertToDto).collect(Collectors.toList());
    }

    public LessonDto createLesson(LessonDto lessonDto) {
        Lesson lesson = convertToEntity(lessonDto);
        Lesson savedLesson = createLesson(lesson);
        return convertToDto(savedLesson);
    }

    public LessonDto updateLesson(Long id, LessonDto lessonDto) {
        Optional<Lesson> existingLessonOpt = lessonRepository.findById(id);
        if (existingLessonOpt.isPresent()) {
            Lesson existingLesson = existingLessonOpt.get();
            // Update fields from DTO
            existingLesson.setTitle(lessonDto.getTitle());
            existingLesson.setDescription(lessonDto.getDescription());
            existingLesson.setContent(lessonDto.getContent());
            existingLesson.setType(lessonDto.getType());
            existingLesson.setDifficulty(lessonDto.getDifficulty());
            existingLesson.setLevel(lessonDto.getLevel());
            existingLesson.setAudioUrl(lessonDto.getAudioUrl());
            existingLesson.setImageUrl(lessonDto.getImageUrl());
            existingLesson.setDuration(lessonDto.getDuration());
            existingLesson.setIsActive(lessonDto.getIsActive());
            existingLesson.setUpdatedAt(LocalDateTime.now());

            Lesson savedLesson = lessonRepository.save(existingLesson);
            return convertToDto(savedLesson);
        }
        throw new EntityNotFoundException("Lesson not found with id: " + id);
    } // Add method to get lessons by category - commented out until Category entity
      // is available
      // public List<LessonDto> getLessonsByCategory(Long categoryId) {
      // return lessonRepository.findByCategoryId(categoryId).stream()
      // .map(this::convertToDto)
      // .collect(Collectors.toList());
      // } // Remove the problematic methods for now
      // Fix the updateExistingLesson method
      // public Lesson updateExistingLesson(Lesson lesson) {
      // return updateLesson(lesson.getId(), convertToLessonDto(lesson));
      // }

    // Add a method to convert Lesson to LessonDto
    // private LessonDto convertToLessonDto(Lesson lesson) {
    // return new LessonDto(
    // lesson.getId(),
    // lesson.getTitle(),
    // lesson.getContent(),
    // lesson.getLevel()
    // // Add other fields as needed
    // );
    // }// Remove any duplicate convertToDto method
    public LessonDto convertToDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setTitle(lesson.getTitle());
        dto.setDescription(lesson.getDescription());
        dto.setContent(lesson.getContent());
        dto.setType(lesson.getType());
        dto.setDifficulty(lesson.getDifficulty());
        dto.setLevel(lesson.getLevel());
        dto.setAudioUrl(lesson.getAudioUrl());
        dto.setImageUrl(lesson.getImageUrl());
        dto.setDuration(lesson.getDuration());
        dto.setIsActive(lesson.getIsActive());
        dto.setCreatedAt(lesson.getCreatedAt());
        dto.setUpdatedAt(lesson.getUpdatedAt());
        // dto.setCategoryId(lesson.getCategoryId()); // Remove this for now
        return dto;
    }

    public Lesson convertToEntity(LessonDto dto) {
        Lesson lesson = new Lesson();
        lesson.setId(dto.getId());
        lesson.setTitle(dto.getTitle());
        lesson.setDescription(dto.getDescription());
        lesson.setContent(dto.getContent());
        lesson.setType(dto.getType());
        lesson.setDifficulty(dto.getDifficulty());
        lesson.setLevel(dto.getLevel());
        lesson.setAudioUrl(dto.getAudioUrl());
        lesson.setImageUrl(dto.getImageUrl());
        lesson.setDuration(dto.getDuration());
        lesson.setIsActive(dto.getIsActive());
        lesson.setCreatedAt(dto.getCreatedAt());
        lesson.setUpdatedAt(dto.getUpdatedAt());
        // lesson.setCategoryId(dto.getCategoryId()); // Remove this for now
        return lesson;
    }

    public List<LessonDto> findAllLessonsAsDto() {
        return lessonRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Temporary method - commented out until Category entity and repository method
    // are available
    public List<LessonDto> findLessonsByCategoryAsDto(Long categoryId) {
        // return lessonRepository.findByCategoryId(categoryId).stream()
        // .map(this::convertToDto)
        // .collect(Collectors.toList());
        return new ArrayList<>(); // Return empty list for now
    }

    public List<LessonDto> getRecentLessons() {
        List<Lesson> recentLessons = lessonRepository.findAll().stream()
                .sorted(Comparator.comparing(Lesson::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());
        return recentLessons.stream()
                .map(this::convertToDto).collect(Collectors.toList());
    }

    public LessonDto updateLessonDto(Long id, LessonDto dto) {
        return lessonRepository.findById(id)
                .map(lesson -> {
                    lesson.setTitle(dto.getTitle());
                    lesson.setDescription(dto.getDescription());
                    lesson.setContent(dto.getContent());
                    lesson.setType(dto.getType());
                    lesson.setDifficulty(dto.getDifficulty());
                    lesson.setLevel(dto.getLevel());
                    lesson.setAudioUrl(dto.getAudioUrl());
                    lesson.setImageUrl(dto.getImageUrl());
                    lesson.setDuration(dto.getDuration());
                    lesson.setIsActive(dto.getIsActive());
                    // lesson.setCategoryId(dto.getCategoryId()); // Commented out - Lesson entity
                    // doesn't have categoryId field
                    return convertToDto(lessonRepository.save(lesson));
                })
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    /**
     * Count active lessons
     */
    public long countActiveLessons() {
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .count();
    }

    /**
     * Get free lessons for basic users (only first 2 basic lessons)
     * Returns lessons with level A1 and isPremium = false, limited to 2 lessons
     */
    public List<LessonDto> getFreeLessonsForBasicUsers() {
        return lessonRepository.findAll().stream()
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .filter(lesson -> "A1".equals(lesson.getLevel())) // Only A1 level
                .filter(lesson -> !Boolean.TRUE.equals(lesson.getIsPremium())) // Not premium
                .sorted(Comparator.comparing(Lesson::getOrderIndex, Comparator.nullsLast(Comparator.naturalOrder())))
                .limit(2) // Only first 2 lessons
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get a specific free lesson by ID if it's accessible for basic users
     */
    public Optional<Lesson> getFreeLessonByIdForBasicUsers(Long id) {
        return lessonRepository.findById(id)
                .filter(lesson -> Boolean.TRUE.equals(lesson.getIsActive()))
                .filter(lesson -> "A1".equals(lesson.getLevel())) // Only A1 level
                .filter(lesson -> !Boolean.TRUE.equals(lesson.getIsPremium())) // Not premium
                .filter(lesson -> lesson.getOrderIndex() != null && lesson.getOrderIndex() <= 2); // Only first 2
                                                                                                  // lessons
    }

    /**
     * Get exercises for a specific lesson
     */
    public List<Exercise> getExercisesByLessonId(Long lessonId) {
        // First verify lesson exists
        if (!lessonRepository.existsById(lessonId)) {
            return new ArrayList<>();
        }
        // Get exercises by lesson ID
        return exerciseRepository.findByLessonIdAndIsActiveTrue(lessonId);
    }
}
