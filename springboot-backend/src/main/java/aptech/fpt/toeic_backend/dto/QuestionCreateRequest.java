/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.dto;

import java.util.List;

/**
 *
 * @author caong
 */
public record QuestionCreateRequest(
    Integer partNumber,
    String questionText,
    String audioUrl,
    String imageUrl,
    String correctOptionLabel,
    List<OptionCreateDTO> options
) {}