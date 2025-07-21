package com.leenglish.toeic.service;

import com.leenglish.toeic.dto.QuestionWithOptions;

import java.util.List;

public interface TestQuestionService {
    List<QuestionWithOptions> getTestQuestions(Long testId, Integer partNumber);
}
