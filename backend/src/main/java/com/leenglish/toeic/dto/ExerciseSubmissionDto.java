package com.leenglish.toeic.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ExerciseSubmissionDto {

    @NotNull(message = "Exercise ID is required")
    @Positive(message = "Exercise ID must be positive")
    private Long exerciseId;

    @NotNull(message = "Lesson ID is required")
    @Positive(message = "Lesson ID must be positive")
    private Long lessonId;

    @NotNull(message = "Time taken is required")
    @Positive(message = "Time taken must be positive")
    private Integer timeTaken; // in seconds

    @Valid
    @NotEmpty(message = "Answers list cannot be empty")
    private List<QuestionAnswerRequest> answers;

    // Constructors
    public ExerciseSubmissionDto() {
    }

    public ExerciseSubmissionDto(Long exerciseId, Long lessonId, Integer timeTaken,
            List<QuestionAnswerRequest> answers) {
        this.exerciseId = exerciseId;
        this.lessonId = lessonId;
        this.timeTaken = timeTaken;
        this.answers = answers;
    }

    // Getters and Setters
    public Long getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(Long exerciseId) {
        this.exerciseId = exerciseId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public List<QuestionAnswerRequest> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuestionAnswerRequest> answers) {
        this.answers = answers;
    }
}
