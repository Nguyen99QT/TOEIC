package com.leenglish.toeic.dto;

public class TestOptionResponse {
    private Long optionId;
    private String label;
    private String content;

    // Constructors
    public TestOptionResponse() {}

    public TestOptionResponse(Long optionId, String label, String content) {
        this.optionId = optionId;
        this.label = label;
        this.content = content;
    }

    // Getters and Setters
    public Long getOptionId() { return optionId; }
    public void setOptionId(Long optionId) { this.optionId = optionId; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
