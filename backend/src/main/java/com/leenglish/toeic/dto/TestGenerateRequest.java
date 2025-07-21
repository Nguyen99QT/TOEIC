/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.dto;

import java.util.Map;

/**
 *
 * @author caong
 */
public record TestGenerateRequest(
    Long userId,
    String title,
    String description,
    Map<Integer, Integer> partQuestionCount
) {}
