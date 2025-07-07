package com.leenglish.toeic.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.leenglish.toeic.dto.QuestionAnswerRequest;
import com.leenglish.toeic.dto.QuestionDto;
import com.leenglish.toeic.service.QuestionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    // ================================================================
    // CHỈ 3 ENDPOINTS CỐT LÕI
    // ================================================================

    /**
     * 1. Get questions for a specific exercise
     */
    @GetMapping("/exercises/{exerciseId}/questions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<QuestionDto>> getQuestionsByExercise(
            @PathVariable Long exerciseId,
            Authentication auth) {

        List<QuestionDto> questions = questionService.getQuestionsByExercise(exerciseId);
        return ResponseEntity.ok(questions);
    }

    /**
     * 2. Submit all answers for an exercise
     */
    @PostMapping("/exercise/{exerciseId}/submit-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> submitExerciseAnswers(
            @PathVariable Long exerciseId,
            @Valid @RequestBody List<QuestionAnswerRequest> answers,
            Authentication auth) {

        String username = auth.getName();
        var result = questionService.submitExerciseAnswers(exerciseId, answers, username);
        return ResponseEntity.ok(result);
    }

    /**
     * 3. Get free sample questions
     */
    @GetMapping("/free")
    public ResponseEntity<List<QuestionDto>> getFreeQuestions(
            @RequestParam(defaultValue = "5") Integer limit) {

        List<QuestionDto> questions = questionService.getFreeQuestions(limit);
        return ResponseEntity.ok(questions);
    }
}
