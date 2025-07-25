package com.leenglish.toeic.controller;

import com.leenglish.toeic.domain.QuestionGroup;
import com.leenglish.toeic.repository.QuestionGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DebugController {

    @Autowired
    private QuestionGroupRepository questionGroupRepository;

    @GetMapping("/question-groups")
    public ResponseEntity<?> debugQuestionGroups() {
        try {
            List<QuestionGroup> allGroups = questionGroupRepository.findAll();
            
            List<Map<String, Object>> groupData = allGroups.stream()
                .map(group -> {
                    Map<String, Object> groupInfo = new HashMap<>();
                    groupInfo.put("groupId", group.getGroupId());
                    groupInfo.put("title", group.getTitle() != null ? group.getTitle() : "No title");
                    groupInfo.put("type", group.getType() != null ? group.getType() : "No type");
                    groupInfo.put("partId", "N/A");
                    groupInfo.put("hasContent", group.getContent() != null && !group.getContent().isEmpty());
                    groupInfo.put("contentLength", group.getContent() != null ? group.getContent().length() : 0);
                    groupInfo.put("questionsCount", group.getQuestions() != null ? group.getQuestions().size() : 0);
                    return groupInfo;
                })
                .toList();
            
            return ResponseEntity.ok(Map.of(
                "message", "Question Groups debug endpoint",
                "totalGroups", allGroups.size(),
                "groups", groupData
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
