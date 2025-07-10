package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(length = 5)
    private String level;

    @Column(name = "question", length = 2000)
    private String question;

    @Column(name = "correct_answer", length = 500)
    private String correctAnswer;

    @Column(name = "options", length = 2000)
    private String options; // JSON string for multiple choice options

    @Column(name = "explanation", length = 1000)
    private String explanation;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "points")
    private Integer points;

    @Column(name = "time_limit_seconds")
    private Integer timeLimitSeconds;

    @Column(name = "audio_url", length = 500)
    private String audioUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "lesson_id")
    private Long lessonId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", insertable = false, updatable = false)
    @JsonBackReference
    private Lesson lesson;

    @OneToMany(mappedBy = "exercise", fetch = FetchType.EAGER)
    private List<Question> questions;

    @Column(name = "difficulty")
    private String difficulty;

    // Constructors
    public Exercise() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getOptions() {
        return options;
    }

    public void setOptions(String options) {
        this.options = options;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public void setTimeLimitSeconds(Integer timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }

    public String getAudioUrl() {
        return audioUrl;
    }

    public void setAudioUrl(String audioUrl) {
        this.audioUrl = audioUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(Boolean isPremium) {
        this.isPremium = isPremium;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    // Business Logic Methods
    public boolean isPremiumExercise() {
        return isPremium != null && isPremium;
    }

    public int getQuestionCount() {
        return questions == null ? 0 : questions.size();
    }

    public boolean hasAudio() {
        return audioUrl != null && !audioUrl.trim().isEmpty();
    }

    public boolean hasImage() {
        return imageUrl != null && !imageUrl.trim().isEmpty();
    }

    public boolean hasMultipleChoice() {
        return options != null && !options.trim().isEmpty();
    }

    public boolean hasTimeLimit() {
        return timeLimitSeconds != null && timeLimitSeconds > 0;
    }

    public boolean isValid() {
        return title != null && !title.trim().isEmpty() &&
                type != null && !type.trim().isEmpty() &&
                question != null && !question.trim().isEmpty();
    }

    // Lifecycle Methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (isActive == null)
            isActive = true;
        if (isPremium == null)
            isPremium = false;
        if (orderIndex == null)
            orderIndex = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
