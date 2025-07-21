package com.leenglish.toeic.controller;

import com.leenglish.toeic.domain.UserResult;
import com.leenglish.toeic.dto.UserResultSummary;
import com.leenglish.toeic.repository.UserResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-results")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class UserResultController {
    
    @Autowired
    private UserResultRepository userResultRepository;
    
    /**
     * Lấy tất cả kết quả test của user
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserResultSummary>> getUserResults(@PathVariable Long userId) {
        try {
            List<UserResult> results = userResultRepository.findByUserIdOrderByFinishedAtDesc(userId);
            List<UserResultSummary> summaries = results.stream()
                .map(result -> new UserResultSummary(
                    result.getResultId(),
                    result.getTest() != null ? result.getTest().getTestId() : null,
                    result.getScoreRead(),
                    result.getScoreListen(),
                    result.getStartedAt() != null ? result.getStartedAt().toLocalDateTime() : null,
                    result.getFinishedAt() != null ? result.getFinishedAt().toLocalDateTime() : null,
                    result.getUser() != null ? result.getUser().getId() : null
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(summaries);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    /**
     * Lấy kết quả test theo ID
     */
    @GetMapping("/{resultId}")
    public ResponseEntity<UserResultSummary> getResultById(@PathVariable Long resultId) {
        try {
            UserResult result = userResultRepository.findById(resultId).orElse(null);
            if (result != null) {
                UserResultSummary summary = new UserResultSummary(
                    result.getResultId(),
                    result.getTest() != null ? result.getTest().getTestId() : null,
                    result.getScoreRead(),
                    result.getScoreListen(),
                    result.getStartedAt() != null ? result.getStartedAt().toLocalDateTime() : null,
                    result.getFinishedAt() != null ? result.getFinishedAt().toLocalDateTime() : null,
                    result.getUser() != null ? result.getUser().getId() : null
                );
                return ResponseEntity.ok(summary);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
