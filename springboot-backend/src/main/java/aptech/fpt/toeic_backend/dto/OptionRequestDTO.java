/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.dto;

import lombok.Data;

/**
 *
 * @author caong
 */
@Data 
public class OptionRequestDTO {
    private String optionLabel; // A, B, C, D
    private String optionText;
}
