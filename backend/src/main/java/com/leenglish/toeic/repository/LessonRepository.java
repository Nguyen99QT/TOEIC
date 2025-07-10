package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.Lesson;
import com.leenglish.toeic.enums.Difficulty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {

        // ========== BASIC METHODS ONLY ==========

        Optional<Lesson> findByTitle(String title);

        List<Lesson> findByDifficulty(Difficulty difficulty);

        Page<Lesson> findByDifficulty(Difficulty difficulty, Pageable pageable);

        @Query("SELECT l FROM Lesson l WHERE l.isActive = true")
        List<Lesson> findActiveLessons();

        @Query("SELECT l FROM Lesson l WHERE l.isActive = true")
        Page<Lesson> findActiveLessons(Pageable pageable);

        long countByDifficulty(Difficulty difficulty);

        @Query("SELECT COUNT(l) FROM Lesson l WHERE l.isActive = true")
        long countActiveLessons();
}
