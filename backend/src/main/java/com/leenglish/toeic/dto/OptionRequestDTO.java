/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.dto;

import lombok.Data;

/**
 *
 * @author caong
 */
@Data 
public class OptionRequestDTO {
    private String optionLabel; // A, B, C, D
    private String optionText;

    // Explicit setters for compilation
    public void setOptionLabel(String optionLabel) { this.optionLabel = optionLabel; }
    public void setOptionText(String optionText) { this.optionText = optionText; }
    
    // Explicit getters for compilation
    public String getOptionLabel() { return optionLabel; }
    public String getOptionText() { return optionText; }
}
