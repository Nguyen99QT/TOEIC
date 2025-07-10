package com.leenglish.toeic.dto;

import java.time.LocalDate;
import java.util.Map;

public class DailyActivityDto {
    private LocalDate date;
    private Integer lessonsCount;
    private Integer completedLessons;
    private Integer totalTimeMinutes;
    private Map<String, Object> lessonDetails;

    public DailyActivityDto() {
    }

    public DailyActivityDto(LocalDate date, Integer lessonsCount, Integer completedLessons,
            Integer totalTimeMinutes, Map<String, Object> lessonDetails) {
        this.date = date;
        this.lessonsCount = lessonsCount;
        this.completedLessons = completedLessons;
        this.totalTimeMinutes = totalTimeMinutes;
        this.lessonDetails = lessonDetails;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getLessonsCount() {
        return lessonsCount;
    }

    public void setLessonsCount(Integer lessonsCount) {
        this.lessonsCount = lessonsCount;
    }

    public Integer getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(Integer completedLessons) {
        this.completedLessons = completedLessons;
    }

    public Integer getTotalTimeMinutes() {
        return totalTimeMinutes;
    }

    public void setTotalTimeMinutes(Integer totalTimeMinutes) {
        this.totalTimeMinutes = totalTimeMinutes;
    }

    public Map<String, Object> getLessonDetails() {
        return lessonDetails;
    }

    public void setLessonDetails(Map<String, Object> lessonDetails) {
        this.lessonDetails = lessonDetails;
    }

    // Utility methods
    public Double getAverageTimePerLesson() {
        if (lessonsCount == null || lessonsCount == 0)
            return 0.0;
        return totalTimeMinutes != null ? totalTimeMinutes.doubleValue() / lessonsCount : 0.0;
    }

    public Double getCompletionRate() {
        if (lessonsCount == null || lessonsCount == 0)
            return 0.0;
        return completedLessons != null ? (completedLessons.doubleValue() / lessonsCount) * 100 : 0.0;
    }
}
