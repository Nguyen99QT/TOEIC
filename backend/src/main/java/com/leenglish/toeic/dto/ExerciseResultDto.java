package com.leenglish.toeic.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ExerciseResultDto {

    private Long id;
    private Integer score;
    private Integer answersCorrect;
    private Integer totalQuestions;
    private Integer timeTaken;
    private LocalDateTime completedAt;
    private List<QuestionResultDto> questionResults;

    // Constructors
    public ExerciseResultDto() {
    }

    public ExerciseResultDto(Long id, Integer score, Integer answersCorrect, Integer totalQuestions,
            Integer timeTaken, LocalDateTime completedAt, List<QuestionResultDto> questionResults) {
        this.id = id;
        this.score = score;
        this.answersCorrect = answersCorrect;
        this.totalQuestions = totalQuestions;
        this.timeTaken = timeTaken;
        this.completedAt = completedAt;
        this.questionResults = questionResults;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getAnswersCorrect() {
        return answersCorrect;
    }

    public void setAnswersCorrect(Integer answersCorrect) {
        this.answersCorrect = answersCorrect;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTimeTaken() {
        return timeTaken;
    }

    public void setTimeTaken(Integer timeTaken) {
        this.timeTaken = timeTaken;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public List<QuestionResultDto> getQuestionResults() {
        return questionResults;
    }

    public void setQuestionResults(List<QuestionResultDto> questionResults) {
        this.questionResults = questionResults;
    }

    // Inner class for question results
    public static class QuestionResultDto {
        private Long questionId;
        private String selectedAnswer;
        private String correctAnswer;
        private Boolean isCorrect;

        // Constructors
        public QuestionResultDto() {
        }

        public QuestionResultDto(Long questionId, String selectedAnswer, String correctAnswer, Boolean isCorrect) {
            this.questionId = questionId;
            this.selectedAnswer = selectedAnswer;
            this.correctAnswer = correctAnswer;
            this.isCorrect = isCorrect;
        }

        // Getters and Setters
        public Long getQuestionId() {
            return questionId;
        }

        public void setQuestionId(Long questionId) {
            this.questionId = questionId;
        }

        public String getSelectedAnswer() {
            return selectedAnswer;
        }

        public void setSelectedAnswer(String selectedAnswer) {
            this.selectedAnswer = selectedAnswer;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }

        public Boolean getIsCorrect() {
            return isCorrect;
        }

        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }
    }
}
