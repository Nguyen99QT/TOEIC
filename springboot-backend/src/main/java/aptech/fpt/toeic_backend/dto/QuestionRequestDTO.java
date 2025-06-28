/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.dto;

import java.util.List;
import lombok.Data;

/**
 *
 * @author caong
 */
@Data 
public class QuestionRequestDTO {
    private String questionText;
    private String correctOption;
    private Integer questionOrder;
    private String imageUrl;
    private String audioUrl;
    private List<OptionRequestDTO> options;
}
