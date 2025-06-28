package aptech.fpt.toeic_backend.controller;

import aptech.fpt.toeic_backend.model.*;
import aptech.fpt.toeic_backend.repository.*;
import java.sql.Timestamp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submit")
public class SubmitController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private TestRepository testRepo;
    @Autowired
    private UserResultRepository resultRepo;
    @Autowired
    private UserAnswerRepository answerRepo;
    @Autowired
    private QuestionRepository questionRepo;

    @PostMapping
    public ResponseEntity<?> submitTest(@RequestBody Map<String, Object> payload) {
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long testId = Long.valueOf(payload.get("testId").toString());
        List<Map<String, Object>> answers = (List<Map<String, Object>>) payload.get("answers");

        User user = userRepo.findById(userId).orElse(null);
        Test test = testRepo.findById(testId).orElse(null);

        if (user == null || test == null) {
            return ResponseEntity.badRequest().build();
        }

        UserResult result = new UserResult();
        result.setUser(user);
        result.setTest(test);
        result.setStartedAt(Timestamp.valueOf(LocalDateTime.now()));

        int correctCount = 0;
        for (Map<String, Object> a : answers) {
            Long qid = Long.valueOf(a.get("questionId").toString());
            String selected = a.get("selectedOption").toString();

            Question q = questionRepo.findById(qid).orElse(null);
            if (q == null) {
                continue;
            }

            if (selected.equalsIgnoreCase(q.getCorrectOption())) {
                correctCount++;
            }
        }

        // TOEIC scoring can be adjusted later
        result.setScoreListen(correctCount * 5); // example
        result.setScoreRead(0); // you may calculate separately
        result.setFinishedAt(Timestamp.valueOf(LocalDateTime.now()));
        resultRepo.save(result);

        for (Map<String, Object> a : answers) {
            Long qid = Long.valueOf(a.get("questionId").toString());
            String selected = a.get("selectedOption").toString();
            Question q = questionRepo.findById(qid).orElse(null);
            if (q == null) {
                continue;
            }

            UserAnswer ua = new UserAnswer();
            ua.setQuestion(q);
            ua.setSelectedOption(selected);
            ua.setResult(result);
            answerRepo.save(ua);
        }

        return ResponseEntity.ok(Map.of("score", result.getScoreListen()));
    }

    @GetMapping("/result/{resultId}")
    public ResponseEntity<?> getTestReview(@PathVariable Long resultId) {
        UserResult result = resultRepo.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found"));
        List<UserAnswer> answers = answerRepo.findByResult(result);

        List<Map<String, Object>> questionDetails = answers.stream().map(answer -> {
            Question q = answer.getQuestion();
            Map<String, Object> questionData = new HashMap<>();
            questionData.put("id", q.getQuestionId());
            questionData.put("part", q.getPartNumber());
            questionData.put("questionText", q.getQuestionText());
            questionData.put("imageUrl", q.getImageUrl());
            questionData.put("audioUrl", q.getAudioUrl());
            questionData.put("correctOption", q.getCorrectOption());
            questionData.put("userOption", answer.getSelectedOption());

            List<Map<String, String>> options = q.getOptions().stream().map(opt -> {
                Map<String, String> o = new HashMap<>();
                o.put("label", opt.getLabel());
                o.put("text", opt.getContent()); 
                return o;
            }).collect(Collectors.toList());
            questionData.put("options", options);

            return questionData;
        }).toList();

        Map<String, Object> response = Map.of(
                "testTitle", result.getTest().getTitle(),
                "user", result.getUser().getName(), 
                "scoreListen", result.getScoreListen(),
                "scoreRead", result.getScoreRead(),
                "questions", questionDetails
        );

        return ResponseEntity.ok(response);
    }
}
