package com.leenglish.toeic.dto;

import java.util.List;

public class TestSubmissionRequest {
    private List<AnswerSubmission> answers;

    public TestSubmissionRequest() {}

    public TestSubmissionRequest(List<AnswerSubmission> answers) {
        this.answers = answers;
    }

    public List<AnswerSubmission> getAnswers() { return answers; }
    public void setAnswers(List<AnswerSubmission> answers) { this.answers = answers; }

    public static class AnswerSubmission {
        private Long questionId;
        private String selectedOption;

        public AnswerSubmission() {}

        public AnswerSubmission(Long questionId, String selectedOption) {
            this.questionId = questionId;
            this.selectedOption = selectedOption;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        
        public String getSelectedOption() { return selectedOption; }
        public void setSelectedOption(String selectedOption) { this.selectedOption = selectedOption; }
    }
}
