package com.leenglish.toeic.dto;

public class PartInfo {
    private Long partId;
    private Integer partNumber;
    private String title;
    private String description;

    public PartInfo() {}

    public PartInfo(Long partId, Integer partNumber, String title, String description) {
        this.partId = partId;
        this.partNumber = partNumber;
        this.title = title;
        this.description = description;
    }

    // Getters and Setters
    public Long getPartId() { return partId; }
    public void setPartId(Long partId) { this.partId = partId; }
    
    public Integer getPartNumber() { return partNumber; }
    public void setPartNumber(Integer partNumber) { this.partNumber = partNumber; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
