/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import com.leenglish.toeic.domain.QuestionGroup;
import com.leenglish.toeic.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 *
 * @author caong
 */
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {
    List<QuestionGroup> findByPart_PartId(Long partId);
    List<QuestionGroup> findByCreatedBy(User createdBy);
}
