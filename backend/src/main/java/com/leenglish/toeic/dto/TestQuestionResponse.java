package com.leenglish.toeic.dto;

import java.util.List;

public class TestQuestionResponse {
    private Long questionId;
    private Integer partNumber;
    private Integer questionOrder;
    private String questionText;
    private String content; // Reading passage content for Part 6 & 7
    private String audioUrl;
    private String imageUrl;
    private List<TestOptionResponse> options;

    // Constructors
    public TestQuestionResponse() {}

    public TestQuestionResponse(Long questionId, Integer partNumber, Integer questionOrder, 
                               String questionText, String content, String audioUrl, 
                               String imageUrl, List<TestOptionResponse> options) {
        this.questionId = questionId;
        this.partNumber = partNumber;
        this.questionOrder = questionOrder;
        this.questionText = questionText;
        this.content = content;
        this.audioUrl = audioUrl;
        this.imageUrl = imageUrl;
        this.options = options;
    }

    // Getters and Setters
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Integer getPartNumber() { return partNumber; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }

    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<TestOptionResponse> getOptions() { return options; }
    public void setOptions(List<TestOptionResponse> options) { this.options = options; }
}
