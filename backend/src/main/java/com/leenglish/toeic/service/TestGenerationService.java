/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.service;

import com.leenglish.toeic.dto.TestGenerateRequest;
import com.leenglish.toeic.dto.RandomTestRequest;
import com.leenglish.toeic.dto.TestSelectionResponse;
import java.util.List;

/**
 *
 * @author caong
 */
public interface TestGenerationService {
    Long generateTestFromBank(TestGenerateRequest request);
    
    /**
     * Generate a random test from question bank following TOEIC structure
     * @param request Configuration for random test generation
     * @return TestSelectionResponse with details of the generated test
     */
    TestSelectionResponse generateRandomTest(RandomTestRequest request);
    
    /**
     * Get list of available tests for selection
     * @return List of existing tests with basic info
     */
    List<TestSelectionResponse> getAvailableTests();
    
    /**
     * Create a quick random test with limited questions per part
     * @return TestSelectionResponse with details of the generated quick test
     */
    TestSelectionResponse generateQuickRandomTest();
}
