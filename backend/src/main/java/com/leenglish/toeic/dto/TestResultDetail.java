package com.leenglish.toeic.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TestResultDetail {
    private Long resultId;
    private String testTitle;
    private Integer totalScore;
    private Integer listeningScore;
    private Integer readingScore;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Double percentage;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private List<QuestionAnswerDetail> answers;
    
    // Constructors
    public TestResultDetail() {}
    
    public TestResultDetail(Long resultId, String testTitle, Integer totalScore, 
                           Integer listeningScore, Integer readingScore, 
                           Integer totalQuestions, Integer correctAnswers, 
                           Double percentage, LocalDateTime startedAt, 
                           LocalDateTime finishedAt) {
        this.resultId = resultId;
        this.testTitle = testTitle;
        this.totalScore = totalScore;
        this.listeningScore = listeningScore;
        this.readingScore = readingScore;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.percentage = percentage;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
    }
    
    // Getters and Setters
    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }
    
    public String getTestTitle() { return testTitle; }
    public void setTestTitle(String testTitle) { this.testTitle = testTitle; }
    
    public Integer getTotalScore() { return totalScore; }
    public void setTotalScore(Integer totalScore) { this.totalScore = totalScore; }
    
    public Integer getListeningScore() { return listeningScore; }
    public void setListeningScore(Integer listeningScore) { this.listeningScore = listeningScore; }
    
    public Integer getReadingScore() { return readingScore; }
    public void setReadingScore(Integer readingScore) { this.readingScore = readingScore; }
    
    public Integer getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public Integer getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(Integer correctAnswers) { this.correctAnswers = correctAnswers; }
    
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }
    
    public List<QuestionAnswerDetail> getAnswers() { return answers; }
    public void setAnswers(List<QuestionAnswerDetail> answers) { this.answers = answers; }
    
    public static class QuestionAnswerDetail {
        private Long questionId;
        private String questionText;
        private String selectedOption;
        private String correctOption;
        private Boolean isCorrect;
        private Integer partNumber;
        private LocalDateTime answeredAt;
        private String imageUrl;
        private String audioUrl;
        private List<OptionDetail> options;
        
        // Constructors
        public QuestionAnswerDetail() {}
        
        public QuestionAnswerDetail(Long questionId, String questionText, 
                                   String selectedOption, String correctOption, 
                                   Boolean isCorrect, Integer partNumber, 
                                   LocalDateTime answeredAt, String imageUrl, String audioUrl) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.selectedOption = selectedOption;
            this.correctOption = correctOption;
            this.isCorrect = isCorrect;
            this.partNumber = partNumber;
            this.answeredAt = answeredAt;
            this.imageUrl = imageUrl;
            this.audioUrl = audioUrl;
        }
        
        // Getters and Setters
        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        
        public String getQuestionText() { return questionText; }
        public void setQuestionText(String questionText) { this.questionText = questionText; }
        
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
        
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        
        public String getAudioUrl() { return audioUrl; }
        public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
        
        public List<OptionDetail> getOptions() { return options; }
        public void setOptions(List<OptionDetail> options) { this.options = options; }
    }
    
    public static class OptionDetail {
        private String label;
        private String content;
        
        public OptionDetail() {}
        
        public OptionDetail(String label, String content) {
            this.label = label;
            this.content = content;
        }
        
        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }
}
