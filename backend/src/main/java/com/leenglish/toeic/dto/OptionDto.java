package com.leenglish.toeic.dto;

public class OptionDto {
    private Long optionId;
    private String label;
    private String content;

    public OptionDto(Long optionId, String label, String content) {
        this.optionId = optionId;
        this.label = label;
        this.content = content;
    }

    public Long getOptionId() { return optionId; }
    public String getLabel() { return label; }
    public String getContent() { return content; }

    public void setOptionId(Long optionId) { this.optionId = optionId; }
    public void setLabel(String label) { this.label = label; }
    public void setContent(String content) { this.content = content; }
}
