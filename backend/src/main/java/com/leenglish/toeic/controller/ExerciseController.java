package com.leenglish.toeic.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.dto.ExerciseDto;
import com.leenglish.toeic.dto.ExerciseResultDto;
import com.leenglish.toeic.dto.ExerciseSubmissionDto;
import com.leenglish.toeic.dto.FeedbackDto;
import com.leenglish.toeic.service.ExerciseResultService;
import com.leenglish.toeic.service.ExerciseService;
import com.leenglish.toeic.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/exercises")
@CrossOrigin(origins = "*")
public class ExerciseController {

    @Autowired
    private ExerciseService exerciseService;

    @Autowired
    private ExerciseResultService exerciseResultService;

    @Autowired
    private UserService userService;

    // Lấy 1 exercise theo id
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getExercise(@PathVariable Long id) {
        return exerciseService.getExerciseById(id)
                .map(this::convertToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Lấy tất cả exercise
    @GetMapping
    public ResponseEntity<?> getAllExercises() {
        return ResponseEntity.ok(
                exerciseService.getAllExercises()
                        .stream()
                        .map(this::convertToDto)
                        .toList());
    }

    // Tạo mới exercise
    @PostMapping
    public ResponseEntity<ExerciseDto> createExercise(@RequestBody ExerciseDto exerciseDto) {
        Exercise exercise = convertToEntity(exerciseDto);
        Exercise savedExercise = exerciseService.createExercise(exercise);
        return ResponseEntity.ok(convertToDto(savedExercise));
    }

    // Xóa exercise
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.ok().build();
    }

    // Nộp bài làm exercise
    @PostMapping("/{id}/submit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExerciseResultDto> submitExercise(
            @PathVariable Long id,
            @Valid @RequestBody ExerciseSubmissionDto submissionDto,
            Authentication authentication) {

        // Validate exercise ID
        if (!id.equals(submissionDto.getExerciseId())) {
            return ResponseEntity.badRequest().build();
        }

        // Get username from authentication and find user
        User user = getUserFromAuthentication(authentication);

        Long userId = user.getId();

        // Log the authenticated user information
        System.out.println("Processing exercise submission for user: " + user.getUsername() +
                " (ID: " + userId + ", Email: " + user.getEmail() + ")");

        // Submit exercise results
        ExerciseResultDto result = exerciseResultService.submitExerciseResult(
                userId, submissionDto);

        return ResponseEntity.ok(result);
    } // Gửi feedback sau khi hoàn thành bài tập

    @PostMapping("/feedback")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> submitFeedback(
            @Valid @RequestBody FeedbackDto feedbackDto,
            Authentication authentication) {

        // Get username from authentication and find user
        User user = getUserFromAuthentication(authentication);

        Long userId = user.getId();

        // Log the authenticated user information
        System.out.println("Processing feedback submission for user: " + user.getUsername() +
                " (ID: " + userId + ", Email: " + user.getEmail() + ")");

        // Submit feedback
        exerciseResultService.submitFeedback(userId, feedbackDto);

        return ResponseEntity.ok().build();
    } // Lấy kết quả làm bài của user

    @GetMapping("/{id}/results")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExerciseResultDto>> getExerciseResults(
            @PathVariable Long id,
            Authentication authentication) {

        // Get username from authentication and find user
        User user = getUserFromAuthentication(authentication);

        Long userId = user.getId();

        // Log the authenticated user information
        System.out.println("Getting exercise results for user: " + user.getUsername() +
                " (ID: " + userId + ", Email: " + user.getEmail() + ")");

        List<ExerciseResultDto> results = exerciseResultService.getUserExerciseResults(
                userId, id);

        return ResponseEntity.ok(results);
    }

    // Chuyển đổi entity sang dto
    private ExerciseDto convertToDto(Exercise exercise) {
        ExerciseDto dto = new ExerciseDto();
        dto.setId(exercise.getId());
        dto.setTitle(exercise.getTitle());
        dto.setDescription(exercise.getDescription());
        dto.setDifficulty(exercise.getDifficulty());
        dto.setType(exercise.getType());
        dto.setCreatedAt(exercise.getCreatedAt());
        dto.setUpdatedAt(exercise.getUpdatedAt());
        return dto;
    }

    // Chuyển đổi dto sang entity
    private Exercise convertToEntity(ExerciseDto dto) {
        Exercise exercise = new Exercise();
        exercise.setId(dto.getId());
        exercise.setTitle(dto.getTitle());
        exercise.setDescription(dto.getDescription());
        exercise.setDifficulty(dto.getDifficulty());
        exercise.setType(dto.getType());
        return exercise;
    }

    /**
     * Helper method to find a user by authentication principal (username or email)
     */
    private User getUserFromAuthentication(Authentication authentication) {
        String usernameOrEmail = authentication.getName();
        Optional<User> userByUsername = userService.findByUsername(usernameOrEmail);
        if (userByUsername.isPresent()) {
            return userByUsername.get();
        }

        Optional<User> userByEmail = userService.findByEmail(usernameOrEmail);
        if (userByEmail.isPresent()) {
            return userByEmail.get();
        }

        throw new UsernameNotFoundException("User not found: " + usernameOrEmail);
    }
}
