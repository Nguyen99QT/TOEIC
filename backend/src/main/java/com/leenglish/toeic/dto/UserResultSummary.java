package com.leenglish.toeic.dto;

import java.time.LocalDateTime;

public class UserResultSummary {
    private Long resultId;
    private Long testId;
    private Integer scoreRead;
    private Integer scoreListen;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private Long userId;
    
    // Constructor
    public UserResultSummary(Long resultId, Long testId, Integer scoreRead, Integer scoreListen, 
                           LocalDateTime startedAt, LocalDateTime finishedAt, Long userId) {
        this.resultId = resultId;
        this.testId = testId;
        this.scoreRead = scoreRead;
        this.scoreListen = scoreListen;
        this.startedAt = startedAt;
        this.finishedAt = finishedAt;
        this.userId = userId;
    }
    
    // Getters and Setters
    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }
    
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public Integer getScoreRead() { return scoreRead; }
    public void setScoreRead(Integer scoreRead) { this.scoreRead = scoreRead; }
    
    public Integer getScoreListen() { return scoreListen; }
    public void setScoreListen(Integer scoreListen) { this.scoreListen = scoreListen; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getFinishedAt() { return finishedAt; }
    public void setFinishedAt(LocalDateTime finishedAt) { this.finishedAt = finishedAt; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}
