/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 *
 * @author caong
 */
@Entity
@Data
@Table(name = "user_answers")
public class UserAnswer {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "answer_id")
    private Long answerId;

    @Column(name = "selected_option", length = 1)
    private String selectedOption;
    
    @Column(name = "correct_option", length = 1)
    private String correctOption;
    
    @Column(name = "is_correct")
    private Boolean isCorrect;
    
    @Column(name = "part_number")
    private Integer partNumber;
    
    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "result_id")
    private UserResult result;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private QuestionTest question;
    
    // Constructors
    public UserAnswer() {}
    
    public UserAnswer(UserResult result, QuestionTest question, String selectedOption, 
                     String correctOption, Boolean isCorrect, Integer partNumber) {
        this.result = result;
        this.question = question;
        this.selectedOption = selectedOption;
        this.correctOption = correctOption;
        this.isCorrect = isCorrect;
        this.partNumber = partNumber;
        this.answeredAt = LocalDateTime.now();
    }
    
    // Explicit getters and setters for compilation
    public Long getAnswerId() { return answerId; }
    public void setAnswerId(Long answerId) { this.answerId = answerId; }
    
    public String getSelectedOption() { return selectedOption; }
    public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }
    
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    
    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
    
    public Integer getPartNumber() { return partNumber; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
    
    public LocalDateTime getAnsweredAt() { return answeredAt; }
    public void setAnsweredAt(LocalDateTime answeredAt) { this.answeredAt = answeredAt; }
    
    public UserResult getResult() { return result; }
    public void setResult(UserResult result) { this.result = result; }
    
    public QuestionTest getQuestion() { return question; }
    public void setQuestion(QuestionTest question) { this.question = question; }
}
