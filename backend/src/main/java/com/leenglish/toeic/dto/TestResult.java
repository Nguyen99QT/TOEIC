package com.leenglish.toeic.dto;

public class TestResult {
    private Long testId;
    private int totalQuestions;
    private int correctAnswers;
    private int score;
    private double percentage;

    public TestResult() {}

    public TestResult(Long testId, int totalQuestions, int correctAnswers, int score, double percentage) {
        this.testId = testId;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.score = score;
        this.percentage = percentage;
    }

    // Getters and Setters
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
    
    public int getCorrectAnswers() { return correctAnswers; }
    public void setCorrectAnswers(int correctAnswers) { this.correctAnswers = correctAnswers; }
    
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
}
