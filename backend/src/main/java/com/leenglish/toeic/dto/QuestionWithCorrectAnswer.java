package com.leenglish.toeic.dto;

import java.util.List;

public class QuestionWithCorrectAnswer {
    private Long questionId;
    private String questionText;
    private String correctAnswer;
    private Integer partNumber;
    private String audioUrl;
    private String imageUrl;
    private List<OptionDTO> options;

    public static class OptionDTO {
        private Long optionId;
        private String label;
        private String content;

        // Getters and Setters
        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
        
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    // Getters and Setters
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
    
    public Integer getPartNumber() { return partNumber; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
    
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public List<OptionDTO> getOptions() { return options; }
    public void setOptions(List<OptionDTO> options) { this.options = options; }
}
