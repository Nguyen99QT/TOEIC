/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;


import aptech.fpt.toeic_backend.model.QuestionLog;
import aptech.fpt.toeic_backend.repository.QuestionLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bot-questions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Cho phép Botpress Cloud gọi API
public class QuestionLogController {

    private final QuestionLogRepository questionLogRepository;

    @PostMapping("/log")
    public ResponseEntity<Void> logQuestion(@RequestBody QuestionLog log) {
        questionLogRepository.save(log);
        return ResponseEntity.ok().build();
    }
}