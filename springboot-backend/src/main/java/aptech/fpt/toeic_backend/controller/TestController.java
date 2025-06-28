/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.controller;

import aptech.fpt.toeic_backend.dto.TestGenerateRequest;
import aptech.fpt.toeic_backend.model.Test;
import aptech.fpt.toeic_backend.repository.TestRepository;
import aptech.fpt.toeic_backend.service.TestGenerationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    @Autowired
    private TestRepository testRepository;
    @Autowired
    private TestGenerationService service;

    @GetMapping
    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Test> getTestById(@PathVariable Long id) {
        return testRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/generate")
    public ResponseEntity<Long> generate(@RequestBody @Valid TestGenerateRequest req) {
        Long id = service.generateTestFromBank(req);
        return ResponseEntity.ok(id);
    }
}
