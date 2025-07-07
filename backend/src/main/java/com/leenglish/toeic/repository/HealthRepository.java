package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.HealthEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthRepository extends JpaRepository<HealthEntity, Long> {
    List<HealthEntity> findByCheckTimeBetween(LocalDateTime start, LocalDateTime end);
    List<HealthEntity> findByStatusNot(String status);
    List<HealthEntity> findTop10ByOrderByCheckTimeDesc();
}
