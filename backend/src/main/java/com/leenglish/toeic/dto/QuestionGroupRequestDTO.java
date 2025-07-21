package com.leenglish.toeic.dto;

import java.util.List;

/**
 * Question Group Request DTO
 */
public class QuestionGroupRequestDTO {
    private String title;
    private String type;
    private String content;
    private String audioUrl;
    private String imageUrl;
    private Long partId;
    private List<QuestionRequestDTO> questions;

    // Getters
    public String getTitle() { return title; }
    public String getType() { return type; }
    public String getContent() { return content; }
    public String getAudioUrl() { return audioUrl; }
    public String getImageUrl() { return imageUrl; }
    public Long getPartId() { return partId; }
    public List<QuestionRequestDTO> getQuestions() { return questions; }

    // Setters
    public void setTitle(String title) { this.title = title; }
    public void setType(String type) { this.type = type; }
    public void setContent(String content) { this.content = content; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setPartId(Long partId) { this.partId = partId; }
    public void setQuestions(List<QuestionRequestDTO> questions) { this.questions = questions; }
}
