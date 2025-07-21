package com.leenglish.toeic.dto;

import java.util.List;

public class TestReviewResult {
    private TestResult testResult;
    private List<QuestionReview> questionReviews;

    public static class QuestionReview {
        private Long questionId;
        private String questionText;
        private String userAnswer;
        private String correctAnswer;
        private boolean isCorrect;
        private Integer partNumber;
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
        
        public String getUserAnswer() { return userAnswer; }
        public void setUserAnswer(String userAnswer) { this.userAnswer = userAnswer; }
        
        public String getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
        
        public boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(boolean isCorrect) { this.isCorrect = isCorrect; }
        
        public Integer getPartNumber() { return partNumber; }
        public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
        
        public List<OptionDTO> getOptions() { return options; }
        public void setOptions(List<OptionDTO> options) { this.options = options; }
    }

    // Getters and Setters
    public TestResult getTestResult() { return testResult; }
    public void setTestResult(TestResult testResult) { this.testResult = testResult; }
    
    public List<QuestionReview> getQuestionReviews() { return questionReviews; }
    public void setQuestionReviews(List<QuestionReview> questionReviews) { this.questionReviews = questionReviews; }
}
