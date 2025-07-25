package com.leenglish.toeic.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.domain.User;
import com.leenglish.toeic.repository.LessonRepository;

@Service
@Transactional
public class LessonServiceImpl {

    @Autowired
    private LessonRepository lessonRepository;

    public Lesson createLesson(Lesson lesson, User creator) {
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        lesson.setIsActive(true);

        if (lesson.getIsPublic() == null) {
            lesson.setIsPublic(true);
        }

        if (lesson.getIsPremium() == null) {
            lesson.setIsPremium(false);
        }

        if (lesson.getOrderIndex() == null) {
            lesson.setOrderIndex(0);
        }

        return lessonRepository.save(lesson);
    }

    @Transactional(readOnly = true)
    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Lesson> getAllActiveLessons() {
        return lessonRepository.findActiveLessons();
    }

    @Transactional(readOnly = true)
    public Page<Lesson> getAllActiveLessons(Pageable pageable) {
        return lessonRepository.findActiveLessons(pageable);
    }

    public Lesson updateLesson(Long id, Lesson updatedLesson, User user) {
        Optional<Lesson> existingLessonOpt = lessonRepository.findById(id);

        if (existingLessonOpt.isEmpty()) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }

        Lesson existingLesson = existingLessonOpt.get();

        // Update fields
        if (updatedLesson.getTitle() != null) {
            existingLesson.setTitle(updatedLesson.getTitle());
        }
        if (updatedLesson.getDescription() != null) {
            existingLesson.setDescription(updatedLesson.getDescription());
        }
        if (updatedLesson.getContent() != null) {
            existingLesson.setContent(updatedLesson.getContent());
        }
        if (updatedLesson.getLevel() != null) {
            existingLesson.setLevel(updatedLesson.getLevel());
        }
        if (updatedLesson.getDifficulty() != null) {
            existingLesson.setDifficulty(updatedLesson.getDifficulty());
        }
        if (updatedLesson.getDuration() != null) {
            existingLesson.setDuration(updatedLesson.getDuration());
        }
        if (updatedLesson.getIsPublic() != null) {
            existingLesson.setIsPublic(updatedLesson.getIsPublic());
        }
        if (updatedLesson.getIsPremium() != null) {
            existingLesson.setIsPremium(updatedLesson.getIsPremium());
        }
        if (updatedLesson.getOrderIndex() != null) {
            existingLesson.setOrderIndex(updatedLesson.getOrderIndex());
        }
        if (updatedLesson.getType() != null) {
            existingLesson.setType(updatedLesson.getType());
        }
        if (updatedLesson.getImageUrl() != null) {
            existingLesson.setImageUrl(updatedLesson.getImageUrl());
        }
        if (updatedLesson.getAudioUrl() != null) {
            existingLesson.setAudioUrl(updatedLesson.getAudioUrl());
        }

        existingLesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(existingLesson);
    }

    public void deleteLesson(Long id, User user) {
        Optional<Lesson> existingLessonOpt = lessonRepository.findById(id);

        if (existingLessonOpt.isEmpty()) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }

        Lesson existingLesson = existingLessonOpt.get();

        // Soft delete
        existingLesson.setIsActive(false);
        existingLesson.setUpdatedAt(LocalDateTime.now());
        lessonRepository.save(existingLesson);
    }

    @Transactional(readOnly = true)
    public List<Lesson> getPublicLessons() {
        return lessonRepository.findActiveLessons();
    }

    @Transactional(readOnly = true)
    public Page<Lesson> getPublicLessons(Pageable pageable) {
        return lessonRepository.findActiveLessons(pageable);
    }

    @Transactional(readOnly = true)
    public List<Lesson> searchLessons(String searchTerm) {
        return lessonRepository.findActiveLessons();
    }

    @Transactional(readOnly = true)
    public List<Lesson> getFeaturedLessons(int limit) {
        return lessonRepository.findActiveLessons(PageRequest.of(0, limit)).getContent();
    }
}
