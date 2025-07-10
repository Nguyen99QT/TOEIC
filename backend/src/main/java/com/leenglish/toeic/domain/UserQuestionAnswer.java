package com.leenglish.toeic.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_question_answers")
public class UserQuestionAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "result_id", nullable = false)
    private UserExerciseResult result;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_answer")
    private String selectedAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    // Constructors, getters and setters
    public UserQuestionAnswer() {
    }

    public UserQuestionAnswer(UserExerciseResult result, Question question, String selectedAnswer, Boolean isCorrect) {
        this.result = result;
        this.question = question;
        this.selectedAnswer = selectedAnswer;
        this.isCorrect = isCorrect;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserExerciseResult getResult() {
        return result;
    }

    public void setResult(UserExerciseResult result) {
        this.result = result;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}

// // Getters and Setters
// public Long getId() {
// return id;
// }

// public void setId(Long id) {
// this.id = id;
// }

// public User getUser() {
// return user;
// }

// public void setUser(User user) {
// this.user = user;
// }

// public ExerciseQuestion getExerciseQuestion() {
// return exerciseQuestion;
// }

// public void setExerciseQuestion(ExerciseQuestion exerciseQuestion) {
// this.exerciseQuestion = exerciseQuestion;
// }

// public UserExerciseAttempt getUserExerciseAttempt() {
// return userExerciseAttempt;
// }

// public void setUserExerciseAttempt(UserExerciseAttempt userExerciseAttempt) {
// this.userExerciseAttempt = userExerciseAttempt;
// }

// public String getUserAnswer() {
// return userAnswer;
// }

// public void setUserAnswer(String userAnswer) {
// this.userAnswer = userAnswer;
// // Auto-check correctness when answer is set
// if (this.exerciseQuestion != null) {
// this.isCorrect = this.exerciseQuestion.isCorrect(userAnswer);
// }
// }

// public Boolean getIsCorrect() {
// return isCorrect;
// }

// public void setIsCorrect(Boolean isCorrect) {
// this.isCorrect = isCorrect;
// }

// public Integer getTimeTaken() {
// return timeTaken;
// }

// public void setTimeTaken(Integer timeTaken) {
// this.timeTaken = timeTaken;
// }

// public LocalDateTime getAnsweredAt() {
// return answeredAt;
// }

// public void setAnsweredAt(LocalDateTime answeredAt) {
// this.answeredAt = answeredAt;
// }

// // Business Logic Methods
// public boolean isAnswered() {
// return userAnswer != null && !userAnswer.trim().isEmpty();
// }

// public void checkCorrectness() {
// if (exerciseQuestion != null && userAnswer != null) {
// this.isCorrect = exerciseQuestion.isCorrect(userAnswer);
// }
// }

// public String getCorrectAnswer() {
// return exerciseQuestion != null ? exerciseQuestion.getCorrectAnswer() : null;
// }

// public long getTimeTakenInMinutes() {
// return timeTaken != null ? timeTaken / 60 : 0;
// }

// public boolean isQuickAnswer(int thresholdSeconds) {
// return timeTaken != null && timeTaken < thresholdSeconds;
// }

// public boolean isSlowAnswer(int thresholdSeconds) {
// return timeTaken != null && timeTaken > thresholdSeconds;
// }
// }
