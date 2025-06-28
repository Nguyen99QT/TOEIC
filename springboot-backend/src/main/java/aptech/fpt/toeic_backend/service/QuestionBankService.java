/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package aptech.fpt.toeic_backend.service;

import aptech.fpt.toeic_backend.dto.QuestionCreateRequest;
import aptech.fpt.toeic_backend.model.Question;
import java.util.List;

/**
 *
 * @author caong
 */
public interface QuestionBankService {
    void addQuestionToBank(QuestionCreateRequest request);
    List<Question> findByPartNumber(Integer partNumber); 
}
