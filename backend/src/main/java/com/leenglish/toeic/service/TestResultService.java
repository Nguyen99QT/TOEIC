package com.leenglish.toeic.service;

import com.leenglish.toeic.dto.TestSubmissionRequest;
import com.leenglish.toeic.dto.TestResult;

public interface TestResultService {
    TestResult calculateResult(Long testId, TestSubmissionRequest request);
}
