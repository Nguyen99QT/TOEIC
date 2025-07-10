package com.leenglish.toeic.service;

import com.leenglish.toeic.domain.HealthEntity;
import com.leenglish.toeic.repository.HealthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class HealthService {

    private final HealthRepository healthRepository;

    @Autowired
    public HealthService(HealthRepository healthRepository) {
        this.healthRepository = healthRepository;
    }

    public HealthEntity recordHealthCheck(Map<String, Object> healthData) {
        HealthEntity healthEntity = new HealthEntity();
        healthEntity.setStatus((String) healthData.get("status"));
        healthEntity.setCheckTime(LocalDateTime.now());
        
        if (healthData.containsKey("memory")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> memory = (Map<String, Object>) healthData.get("memory");
            healthEntity.setTotalMemory((String) memory.get("total"));
            healthEntity.setFreeMemory((String) memory.get("free"));
            healthEntity.setMaxMemory((String) memory.get("max"));
        }
        
        if (healthData.containsKey("server")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> server = (Map<String, Object>) healthData.get("server");
            healthEntity.setJavaVersion((String) server.get("javaVersion"));
            healthEntity.setOsName((String) server.get("osName"));
            healthEntity.setAvailableProcessors((Integer) server.get("availableProcessors"));
        }
        
        return healthRepository.save(healthEntity);
    }

    public List<HealthEntity> getRecentHealthChecks() {
        return healthRepository.findTop10ByOrderByCheckTimeDesc();
    }

    public List<HealthEntity> getHealthChecksByDateRange(LocalDateTime start, LocalDateTime end) {
        return healthRepository.findByCheckTimeBetween(start, end);
    }

    public List<HealthEntity> getUnhealthyChecks() {
        return healthRepository.findByStatusNot("UP");
    }
}
