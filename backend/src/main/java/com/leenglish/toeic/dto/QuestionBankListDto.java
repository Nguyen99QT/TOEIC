package com.leenglish.toeic.dto;

public class QuestionBankListDto {
    private Long questionId;
    private String questionText;
    private String imageUrl;
    private String audioUrl;
    private String correctOption;
    private Integer questionOrder;
    private Integer partNumber;
    
    // Constructors
    public QuestionBankListDto() {}
    
    public QuestionBankListDto(Long questionId, String questionText, String imageUrl, 
                              String audioUrl, String correctOption, Integer questionOrder, 
                              Integer partNumber) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.imageUrl = imageUrl;
        this.audioUrl = audioUrl;
        this.correctOption = correctOption;
        this.questionOrder = questionOrder;
        this.partNumber = partNumber;
    }
    
    // Getters and Setters
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    
    public String getCorrectOption() { return correctOption; }
    public void setCorrectOption(String correctOption) { this.correctOption = correctOption; }
    
    public Integer getQuestionOrder() { return questionOrder; }
    public void setQuestionOrder(Integer questionOrder) { this.questionOrder = questionOrder; }
    
    public Integer getPartNumber() { return partNumber; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
}
