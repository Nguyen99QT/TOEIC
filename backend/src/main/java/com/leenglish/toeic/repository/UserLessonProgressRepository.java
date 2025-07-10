package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);

    List<UserLessonProgress> findByUserIdOrderByLastAccessedAtDesc(Long userId);

    List<UserLessonProgress> findByUserIdAndStatus(Long userId, String status);

    @Query("SELECT ulp FROM UserLessonProgress ulp WHERE ulp.user.id = :userId AND ulp.status = 'COMPLETED' ORDER BY ulp.completedAt DESC")
    List<UserLessonProgress> findCompletedLessonsByUser(@Param("userId") Long userId);

    @Query("SELECT COUNT(ulp) FROM UserLessonProgress ulp WHERE ulp.user.id = :userId AND ulp.status = 'COMPLETED'")
    Long countCompletedLessonsByUser(@Param("userId") Long userId);

    @Query("SELECT AVG(ulp.progressPercentage) FROM UserLessonProgress ulp WHERE ulp.user.id = :userId")
    Double getAverageProgressByUser(@Param("userId") Long userId);

    @Query("SELECT SUM(ulp.timeSpentMinutes) FROM UserLessonProgress ulp WHERE ulp.user.id = :userId")
    Long getTotalTimeSpentByUser(@Param("userId") Long userId);
}
