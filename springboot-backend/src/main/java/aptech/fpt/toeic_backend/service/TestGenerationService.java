/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package aptech.fpt.toeic_backend.service;

import aptech.fpt.toeic_backend.dto.TestGenerateRequest;

/**
 *
 * @author caong
 */
public interface TestGenerationService {
    Long generateTestFromBank(TestGenerateRequest request);
}
