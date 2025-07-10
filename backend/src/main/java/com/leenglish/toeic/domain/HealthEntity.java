package com.leenglish.toeic.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checks")
public class HealthEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "status")
    private String status;

    @Column(name = "check_time")
    private LocalDateTime checkTime;

    @Column(name = "total_memory")
    private String totalMemory;

    @Column(name = "free_memory")
    private String freeMemory;

    @Column(name = "max_memory")
    private String maxMemory;

    @Column(name = "available_processors")
    private Integer availableProcessors;
    
    @Column(name = "java_version")
    private String javaVersion;
    
    @Column(name = "os_name")
    private String osName;
    
    @Column(name = "details", length = 1000)
    private String details;

    // Constructors
    public HealthEntity() {
    }

    public HealthEntity(String status, LocalDateTime checkTime) {
        this.status = status;
        this.checkTime = checkTime;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(LocalDateTime checkTime) {
        this.checkTime = checkTime;
    }

    public String getTotalMemory() {
        return totalMemory;
    }

    public void setTotalMemory(String totalMemory) {
        this.totalMemory = totalMemory;
    }

    public String getFreeMemory() {
        return freeMemory;
    }

    public void setFreeMemory(String freeMemory) {
        this.freeMemory = freeMemory;
    }

    public String getMaxMemory() {
        return maxMemory;
    }

    public void setMaxMemory(String maxMemory) {
        this.maxMemory = maxMemory;
    }

    public Integer getAvailableProcessors() {
        return availableProcessors;
    }

    public void setAvailableProcessors(Integer availableProcessors) {
        this.availableProcessors = availableProcessors;
    }

    public String getJavaVersion() {
        return javaVersion;
    }

    public void setJavaVersion(String javaVersion) {
        this.javaVersion = javaVersion;
    }

    public String getOsName() {
        return osName;
    }

    public void setOsName(String osName) {
        this.osName = osName;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}
