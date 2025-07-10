package com.leenglish.toeic.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
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

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.dto.ExerciseDto;
import com.leenglish.toeic.dto.LessonDto;
import com.leenglish.toeic.service.LessonService;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/{id}")
    public ResponseEntity<LessonDto> getLesson(@PathVariable Long id) {
        return lessonService.getLessonById(id)
                .map(lessonService::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Lesson>> getAllLessons() {
        List<Lesson> lessons = lessonService.getAllLessons();
        return ResponseEntity.ok(lessons);
    }

    @PostMapping
    public ResponseEntity<LessonDto> createLesson(@RequestBody LessonDto lessonDto) {
        LessonDto createdLesson = lessonService.createLesson(lessonDto);
        return ResponseEntity.ok().body(createdLesson);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<LessonDto>> getLessonsByType(@PathVariable String type) {
        List<LessonDto> lessons = lessonService.getLessonsByType(type);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<LessonDto>> getLessonsByDifficulty(@PathVariable String difficulty) {
        List<LessonDto> lessons = lessonService.getLessonsByDifficulty(difficulty);
        return ResponseEntity.ok(lessons);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long id, @RequestBody LessonDto lessonDto) {
        LessonDto updatedLesson = lessonService.updateLesson(id, lessonDto);
        return ResponseEntity.ok().body(updatedLesson);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<LessonDto>> getLessonsByCategory(@PathVariable Long categoryId) {
        // Temporarily comment out until the method is available
        // return
        // ResponseEntity.ok().body(lessonService.findLessonsByCategoryAsDto(categoryId));
        return ResponseEntity.ok().body(new ArrayList<>());
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<LessonDto>> getLessonsByLevel(@PathVariable String level) {
        List<Lesson> lessons = lessonService.getLessonsByLevel(level);
        List<LessonDto> lessonDtos = lessons.stream()
                .map(lessonService::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lessonDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<LessonDto>> searchLessonsByTitle(@RequestParam String title) {
        List<LessonDto> lessons = lessonService.searchLessonsByTitle(title);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<LessonDto>> getRecentLessons() {
        return ResponseEntity.ok().body(lessonService.getRecentLessons());
    }

    /**
     * Get free lessons for non-premium users (only first 2 basic lessons)
     * This endpoint is accessible without authentication
     */
    @GetMapping("/free")
    public ResponseEntity<List<LessonDto>> getFreeLessons() {
        List<LessonDto> freeLessons = lessonService.getFreeLessonsForBasicUsers();
        return ResponseEntity.ok(freeLessons);
    }

    /**
     * Check if a specific lesson is accessible for basic users
     */
    @GetMapping("/free/{id}")
    public ResponseEntity<LessonDto> getFreeLessonById(@PathVariable Long id) {
        return lessonService.getFreeLessonByIdForBasicUsers(id)
                .map(lessonService::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{lessonId}/exercises")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ExerciseDto>> getExercisesByLessonId(@PathVariable Long lessonId) {
        List<Exercise> exercises = lessonService.getExercisesByLessonId(lessonId);
        List<ExerciseDto> exerciseDtos = exercises.stream()
                .map(this::convertExerciseToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(exerciseDtos);
    }

    @GetMapping("/{lessonId}/exercises/{exerciseId}")
    @Transactional(readOnly = true)
    public ResponseEntity<ExerciseDto> getExerciseById(@PathVariable Long lessonId, @PathVariable Long exerciseId) {
        List<Exercise> exercises = lessonService.getExercisesByLessonId(lessonId);
        Exercise exercise = exercises.stream()
                .filter(ex -> ex.getId().equals(exerciseId))
                .findFirst()
                .orElse(null);

        if (exercise == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(convertExerciseToDto(exercise));
    }

    private ExerciseDto convertExerciseToDto(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setTitle(exercise.getTitle());
        dto.setDescription(exercise.getDescription());
        dto.setType(exercise.getType());
        dto.setDifficulty(exercise.getDifficulty() != null ? exercise.getDifficulty() : exercise.getDifficultyLevel());

        // Convert timeLimitSeconds to minutes for duration
        if (exercise.getTimeLimitSeconds() != null) {
            dto.setDuration(exercise.getTimeLimitSeconds() / 60);
        } else {
            dto.setDuration(30); // Default 30 minutes
        }

        dto.setQuestionsCount(exercise.getQuestions() != null ? exercise.getQuestions().size() : 0);
        dto.setIsCompleted(false); // TODO: Implement user progress tracking
        dto.setIsLocked(false); // TODO: Implement exercise locking logic
        dto.setPoints(exercise.getPoints() != null ? exercise.getPoints() : 0);

        // Also set the original DTO fields for compatibility
        dto.setTimeLimit(dto.getDuration());
        dto.setTotalQuestions(dto.getQuestionsCount());
        dto.setIsActive(exercise.getIsActive());
        dto.setCreatedAt(exercise.getCreatedAt());
        dto.setUpdatedAt(exercise.getUpdatedAt());

        return dto;
    }
}
