package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long optionId;

    private String label;   // A, B, C, D
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @JsonBackReference
    private QuestionTest question;

    // Explicit getters for compilation
    public Long getOptionId() { return optionId; }
    public String getLabel() { return label; }
    public String getContent() { return content; }
    public QuestionTest getQuestion() { return question; }

    // Explicit setters for compilation
    public void setQuestion(QuestionTest question) { this.question = question; }
    public void setLabel(String label) { this.label = label; }
    public void setContent(String content) { this.content = content; }
}