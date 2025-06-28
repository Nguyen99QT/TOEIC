/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.service.impl;

import aptech.fpt.toeic_backend.dto.*;
import aptech.fpt.toeic_backend.model.*;
import aptech.fpt.toeic_backend.repository.*;
import aptech.fpt.toeic_backend.service.QuestionBankService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class QuestionBankServiceImpl implements QuestionBankService {

    private final QuestionRepository questionRepo;
    private final OptionRepository optionRepo;

    public QuestionBankServiceImpl(QuestionRepository questionRepo, OptionRepository optionRepo) {
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
    }

    @Override
    public void addQuestionToBank(QuestionCreateRequest req) {
        Question q = new Question();
        q.setPartNumber(req.partNumber());
        q.setQuestionText(req.questionText());
        q.setAudioUrl(req.audioUrl());
        q.setImageUrl(req.imageUrl());
        q.setCorrectOption(req.correctOptionLabel());
        questionRepo.save(q);

        for (OptionCreateDTO o : req.options()) {
            Option opt = new Option();
            opt.setQuestion(q);
            opt.setLabel(o.label());
            opt.setContent(o.content());
            optionRepo.save(opt);
        }
    }
    @Override
    public List<Question> findByPartNumber(Integer partNumber) {
        return questionRepo.findByPartNumber(partNumber);  // Assume we have a method to query by part
    }
}
