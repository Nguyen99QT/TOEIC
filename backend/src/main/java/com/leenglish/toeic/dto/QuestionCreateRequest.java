/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.dto;

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