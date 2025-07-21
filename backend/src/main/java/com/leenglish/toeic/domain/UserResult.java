/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.List;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Data
@Table(name = "user_result")
public class UserResult {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Column(name = "score_listen")
    private Integer scoreListen;
    
    @Column(name = "score_read")
    private Integer scoreRead;

    @Column(name = "started_at")
    private Timestamp startedAt;
    
    @Column(name = "finished_at")
    private Timestamp finishedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id")
    private Test test;
    
    @OneToMany(mappedBy = "result", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<UserAnswer> userAnswers;
    
    // Constructors
    public UserResult() {}
    
    public UserResult(User user, Test test, Integer scoreListen, Integer scoreRead) {
        this.user = user;
        this.test = test;
        this.scoreListen = scoreListen;
        this.scoreRead = scoreRead;
        this.startedAt = new Timestamp(System.currentTimeMillis());
        this.finishedAt = new Timestamp(System.currentTimeMillis());
    }
    
    /**
     * Tính tổng điểm TOEIC (listening + reading)
     */
    public Integer getTotalScore() {
        if (scoreListen == null || scoreRead == null) return 0;
        return scoreListen + scoreRead;
    }
    
    // Explicit getters and setters for compilation
    public Long getResultId() { return resultId; }
    public void setResultId(Long resultId) { this.resultId = resultId; }
    
    public Integer getScoreListen() { return scoreListen; }
    public void setScoreListen(Integer scoreListen) { this.scoreListen = scoreListen; }
    
    public Integer getScoreRead() { return scoreRead; }
    public void setScoreRead(Integer scoreRead) { this.scoreRead = scoreRead; }
    
    public Timestamp getStartedAt() { return startedAt; }
    public void setStartedAt(Timestamp startedAt) { this.startedAt = startedAt; }
    
    public Timestamp getFinishedAt() { return finishedAt; }
    public void setFinishedAt(Timestamp finishedAt) { this.finishedAt = finishedAt; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public Test getTest() { return test; }
    public void setTest(Test test) { this.test = test; }
    
    public List<UserAnswer> getUserAnswers() { return userAnswers; }
    public void setUserAnswers(List<UserAnswer> userAnswers) { this.userAnswers = userAnswers; }
}

