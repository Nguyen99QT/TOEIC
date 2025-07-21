/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.dto;

import java.util.List;
import lombok.Data;

/**
 *
 * @author caong
 */
@Data 
public class QuestionRequestDTO {
    private String questionText;
    private String correctOption;
    private Integer questionOrder;
    private String imageUrl;
    private String audioUrl;
    private List<OptionRequestDTO> options;

    // Explicit setters for compilation
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    public void setOptions(List<OptionRequestDTO> options) { this.options = options; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    
    // Explicit getters for compilation
    public String getQuestionText() { return questionText; }
    public String getCorrectOption() { return correctOption; }
    public Integer getQuestionOrder() { return questionOrder; }
    public String getImageUrl() { return imageUrl; }
    public String getAudioUrl() { return audioUrl; }
    public List<OptionRequestDTO> getOptions() { return options; }
}
