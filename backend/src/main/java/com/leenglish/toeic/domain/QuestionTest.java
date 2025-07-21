/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

/**
 *
 * @author caong
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    private String questionText;
    private String imageUrl;
    private String audioUrl;
    private String correctOption;
    private Integer questionOrder;

    private Integer partNumber;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonBackReference
    private QuestionGroup group;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Option> options;
    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;

    // Explicit getters for compilation
    public Long getQuestionId() { return questionId; }
    public String getQuestionText() { return questionText; }
    public String getImageUrl() { return imageUrl; }
    public String getAudioUrl() { return audioUrl; }
    public String getCorrectOption() { return correctOption; }
    public Integer getQuestionOrder() { return questionOrder; }
    public Integer getPartNumber() { return partNumber; }
    public User getCreatedBy() { return createdBy; }
    public QuestionGroup getGroup() { return group; }
    
    public List<Option> getOptions() { return options; }
    public Part getPart() { return part; }

    // Explicit setters for compilation  
    public void setOptions(List<Option> options) { this.options = options; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    public void setGroup(QuestionGroup group) { this.group = group; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
    public void setPart(Part part) { this.part = part; }
}
