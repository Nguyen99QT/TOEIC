package com.leenglish.toeic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import com.leenglish.toeic.dto.QuestionCreateRequest;
import com.leenglish.toeic.dto.OptionCreateDTO;
import com.leenglish.toeic.service.QuestionBankService;
import com.leenglish.toeic.repository.QuestionTestRepository;
import java.util.Arrays;
import java.util.List;

@Component
public class SampleDataLoader implements CommandLineRunner {

    @Autowired
    private QuestionBankService questionBankService;
    
    @Autowired
    private QuestionTestRepository questionTestRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // 🔥 KIỂM TRA ĐÃ CÓ SAMPLE DATA CHƯA
            if (questionTestRepository.count() > 0) {
                System.out.println("🚫 Sample data already exists, skipping initialization...");
                return;
            }
            
            System.out.println("🌱 Loading sample data...");
            
            // Thêm câu hỏi Part 1 - Picture Description
            addQuestion(1, "What is shown in the picture?", "A",
                "A man reading a book", "A woman cooking", "Children playing", "People walking");

            // Thêm câu hỏi Part 2 - Question-Response  
            addQuestion(2, "Where does this conversation take place?", "B",
                "At a restaurant", "At a library", "At a bank", "At a hospital");

            // Thêm câu hỏi Part 5 - Grammar 1
            addQuestion(5, "The report must be submitted _____ Friday afternoon.", "C",
                "in", "on", "by", "at");

            // Thêm câu hỏi Part 5 - Grammar 2
            addQuestion(5, "The new employee has been working here _____ six months.", "B",
                "since", "for", "during", "from");

            // Thêm câu hỏi Part 6 - Text Completion
            addQuestion(6, "All employees are _____ to attend the mandatory training session.", "A",
                "required", "requiring", "requirement", "require");

            // Thêm câu hỏi Part 7 - Reading Comprehension
            addQuestion(7, "According to the memo, what is the purpose of the meeting?", "D",
                "To discuss budget cuts", "To review quarterly reports", 
                "To announce new policies", "To plan the annual conference");

            System.out.println("✅ Sample data loaded successfully!");
            
        } catch (Exception e) {
            System.err.println("❌ Error loading sample data: " + e.getMessage());
        }
    }

    private void addQuestion(int partNumber, String questionText, String correctOption,
                           String optA, String optB, String optC, String optD) {
        try {
            List<OptionCreateDTO> options = Arrays.asList(
                new OptionCreateDTO("A", optA),
                new OptionCreateDTO("B", optB),
                new OptionCreateDTO("C", optC),
                new OptionCreateDTO("D", optD)
            );

            QuestionCreateRequest request = new QuestionCreateRequest(
                partNumber, questionText, null, null, correctOption, options);

            questionBankService.addQuestionToBank(request);
            System.out.println("✅ Added Part " + partNumber + " question: " + questionText);
            
        } catch (Exception e) {
            System.err.println("❌ Failed to add question: " + e.getMessage());
        }
    }
}
