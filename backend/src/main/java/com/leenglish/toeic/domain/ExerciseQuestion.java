// package com.leenglish.toeic.domain;

// import jakarta.persistence.*;
// import java.time.LocalDateTime;

// @Entity
// @Table(name = "exercise_question")
// public class ExerciseQuestion {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;

//     @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
//     private String questionText;

//     @Column(name = "options", columnDefinition = "LONGTEXT")
//     private String options; // JSON chuỗi lưu các lựa chọn

//     @Column(name = "correct_answer", nullable = false, columnDefinition = "TEXT")
//     private String correctAnswer;

//     @Column(name = "audio_url", length = 500)
//     private String audioUrl;

//     @Column(name = "image_url", length = 500)
//     private String imageUrl;

//     @Column(name = "type", nullable = false, length = 100)
//     private String type; // Loại câu hỏi: multiple choice, fill-in,...

//     @Column(name = "exercise_id", nullable = false)
//     private Long exerciseId;

//     @Column(name = "created_at")
//     private LocalDateTime createdAt;

//     @Column(name = "updated_at")
//     private LocalDateTime updatedAt;

//     @Column(name = "order_index")
//     private Integer orderIndex;

//     // Quan hệ nhiều câu hỏi - 1 bài tập
//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "exercise_id", insertable = false, updatable = false)
//     private Exercise exercise;

//     // Constructors
//     public ExerciseQuestion() {
//     }

//     public ExerciseQuestion(String questionText, String correctAnswer, String type, Long exerciseId) {
//         this.questionText = questionText;
//         this.correctAnswer = correctAnswer;
//         this.type = type;
//         this.exerciseId = exerciseId;
//     }

//     // Getters and Setters
//     public Long getId() {
//         return id;
//     }

//     public void setId(Long id) {
//         this.id = id;
//     }

//     public String getQuestionText() {
//         return questionText;
//     }

//     public void setQuestionText(String questionText) {
//         this.questionText = questionText;
//     }

//     public String getOptions() {
//         return options;
//     }

//     public void setOptions(String options) {
//         this.options = options;
//     }

//     public String getCorrectAnswer() {
//         return correctAnswer;
//     }

//     public void setCorrectAnswer(String correctAnswer) {
//         this.correctAnswer = correctAnswer;
//     }

//     public String getAudioUrl() {
//         return audioUrl;
//     }

//     public void setAudioUrl(String audioUrl) {
//         this.audioUrl = audioUrl;
//     }

//     public String getImageUrl() {
//         return imageUrl;
//     }

//     public void setImageUrl(String imageUrl) {
//         this.imageUrl = imageUrl;
//     }

//     public String getType() {
//         return type;
//     }

//     public void setType(String type) {
//         this.type = type;
//     }

//     public Long getExerciseId() {
//         return exerciseId;
//     }

//     public void setExerciseId(Long exerciseId) {
//         this.exerciseId = exerciseId;
//     }

//     public Exercise getExercise() {
//         return exercise;
//     }

//     public void setExercise(Exercise exercise) {
//         this.exercise = exercise;
//     }

//     public LocalDateTime getCreatedAt() {
//         return createdAt;
//     }

//     public void setCreatedAt(LocalDateTime createdAt) {
//         this.createdAt = createdAt;
//     }

//     public LocalDateTime getUpdatedAt() {
//         return updatedAt;
//     }

//     public void setUpdatedAt(LocalDateTime updatedAt) {
//         this.updatedAt = updatedAt;
//     }

//     public Integer getOrderIndex() {
//         return orderIndex;
//     }

//     public void setOrderIndex(Integer orderIndex) {
//         this.orderIndex = orderIndex;
//     }

//     // Business Logic Methods
//     public boolean isCorrect(String answer) {
//         if (answer == null || correctAnswer == null)
//             return false;
//         return correctAnswer.trim().equalsIgnoreCase(answer.trim());
//     }

//     public String[] getOptionArray() {
//         if (options == null)
//             return new String[0];
//         return options.replace("[", "")
//                 .replace("]", "")
//                 .replace("\"", "")
//                 .split(",");
//     }

//     public boolean hasAudio() {
//         return audioUrl != null && !audioUrl.trim().isEmpty();
//     }

//     public boolean hasImage() {
//         return imageUrl != null && !imageUrl.trim().isEmpty();
//     }

//     public boolean hasMultipleChoice() {
//         return options != null && !options.trim().isEmpty();
//     }
// }
