package com.leenglish.toeic.dto;

import java.util.List;

public class QuestionDetailDto {
    private Long questionId;
    private String questionText;
    private String imageUrl;
    private String audioUrl;
    private String correctOption;
    private Integer questionOrder;
    private Integer partNumber;
    private List<OptionDto> options;

    public QuestionDetailDto(Long questionId, String questionText, String imageUrl, String audioUrl, String correctOption, Integer questionOrder, Integer partNumber, List<OptionDto> options) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.imageUrl = imageUrl;
        this.audioUrl = audioUrl;
        this.correctOption = correctOption;
        this.questionOrder = questionOrder;
        this.partNumber = partNumber;
        this.options = options;
    }

    public Long getQuestionId() { return questionId; }
    public String getQuestionText() { return questionText; }
    public String getImageUrl() { return imageUrl; }
    public String getAudioUrl() { return audioUrl; }
    public String getCorrectOption() { return correctOption; }
    public Integer getQuestionOrder() { return questionOrder; }
    public Integer getPartNumber() { return partNumber; }
    public List<OptionDto> getOptions() { return options; }

    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
    public void setOptions(List<OptionDto> options) { this.options = options; }
}
