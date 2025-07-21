package com.leenglish.toeic.dto;

import java.util.List;

public class QuestionWithOptions {
    private Long questionId;
    private String questionText;
    private String audioUrl;
    private String imageUrl;
    private List<OptionDTO> options;

    // Constructors
    public QuestionWithOptions() {}

    public QuestionWithOptions(Long questionId, String questionText, String audioUrl, String imageUrl, List<OptionDTO> options) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.audioUrl = audioUrl;
        this.imageUrl = imageUrl;
        this.options = options;
    }

    // Getters and Setters
    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }
    
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    
    public List<OptionDTO> getOptions() { return options; }
    public void setOptions(List<OptionDTO> options) { this.options = options; }

    public static class OptionDTO {
        private Long optionId;
        private String label;
        private String content;

        public OptionDTO() {}

        public OptionDTO(Long optionId, String label, String content) {
            this.optionId = optionId;
            this.label = label;
            this.content = content;
        }

        // Getters and Setters
        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
        
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
