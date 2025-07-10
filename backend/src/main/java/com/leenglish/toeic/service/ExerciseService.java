package com.leenglish.toeic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.leenglish.toeic.domain.Exercise;
import com.leenglish.toeic.domain.Question;
import com.leenglish.toeic.repository.ExerciseRepository;
import com.leenglish.toeic.repository.QuestionRepository;

@Service
public class ExerciseService {

    private final QuestionRepository exerciseQuestionRepository;

    @Autowired
    public ExerciseService(QuestionRepository exerciseQuestionRepository) {
        this.exerciseQuestionRepository = exerciseQuestionRepository;
    }

    @Autowired
    private ExerciseRepository exerciseRepository;

    // Chỉ giữ lại các method thao tác với Question

    public Question saveQuestion(Question question) {
        if (question.getId() == null) {
            question.setCreatedAt(LocalDateTime.now());
        }
        question.setUpdatedAt(LocalDateTime.now());
        return exerciseQuestionRepository.save(question);
    }

    public Question updateQuestion(Question question) {
        question.setUpdatedAt(LocalDateTime.now());
        return exerciseQuestionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        exerciseQuestionRepository.deleteById(id);
    }

    public Optional<Exercise> getExerciseById(Long id) {
        return exerciseRepository.findById(id);
    }

    public List<Exercise> getAllExercises() {
        return exerciseRepository.findAll();
    }

    public Exercise createExercise(Exercise exercise) {
        exercise.setCreatedAt(LocalDateTime.now());
        exercise.setUpdatedAt(LocalDateTime.now());
        return exerciseRepository.save(exercise);
    }

    public void deleteExercise(Long id) {
        exerciseRepository.deleteById(id);
    }

    public long getTotalExerciseCount() {
        return exerciseRepository.count();
    }
}
