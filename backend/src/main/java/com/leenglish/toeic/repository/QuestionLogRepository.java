/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leenglish.toeic.domain.QuestionLog;

/**
 *
 * @author caong
 */
public interface QuestionLogRepository extends JpaRepository<QuestionLog, Long> {
    
}
