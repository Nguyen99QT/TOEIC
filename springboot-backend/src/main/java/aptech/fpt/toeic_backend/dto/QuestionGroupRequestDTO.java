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
public class QuestionGroupRequestDTO {
    private String title;
    private String type;
    private String content;
    private String audioUrl;
    private String imageUrl;
    private Long partId;
    private List<QuestionRequestDTO> questions;
}
