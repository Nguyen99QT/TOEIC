
package com.leenglish.toeic.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.List;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Table(name = "test")
@Data
public class Test {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    private String title;
    private String description;
    private Timestamp createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    // Gợi ý thêm: 1 đề gắn nhiều câu hỏi từ ngân hàng qua bảng TestQuestion
    @OneToMany(mappedBy = "test", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestQuestion> testQuestions;

    // Explicit getters for compilation
    public Long getTestId() { return testId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Timestamp getCreatedAt() { return createdAt; }
    public User getCreatedBy() { return createdBy; }
    public List<TestQuestion> getTestQuestions() { return testQuestions; }

    // Explicit setters for compilation
    public void setTestId(Long testId) { this.testId = testId; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    public void setTestQuestions(List<TestQuestion> testQuestions) { this.testQuestions = testQuestions; }
}