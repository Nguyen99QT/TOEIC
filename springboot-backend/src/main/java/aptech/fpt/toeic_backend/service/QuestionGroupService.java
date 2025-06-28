/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.service;
import aptech.fpt.toeic_backend.dto.*;
import aptech.fpt.toeic_backend.model.*;
import aptech.fpt.toeic_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
/**
 *
 * @author caong
 */
@Service 
public class QuestionGroupService {
    @Autowired
    private QuestionGroupRepository groupRepo;
    @Autowired
    private QuestionRepository questionRepo;
    @Autowired
    private OptionRepository optionRepo;
    @Autowired
    private PartRepository partRepo;

    public QuestionGroup createGroupWithQuestions(QuestionGroupRequestDTO dto) {
        QuestionGroup group = new QuestionGroup();
        group.setTitle(dto.getTitle());
        group.setType(dto.getType());
        group.setContent(dto.getContent());
        group.setAudioUrl(dto.getAudioUrl());
        group.setImageUrl(dto.getImageUrl());

        if (dto.getPartId() != null) {
            Part part = partRepo.findById(dto.getPartId()).orElse(null);
            group.setPart(part);
        }

        List<Question> questionList = new ArrayList<>();
        for (QuestionRequestDTO qdto : dto.getQuestions()) {
            Question q = new Question();
            q.setQuestionText(qdto.getQuestionText());
            q.setCorrectOption(qdto.getCorrectOption());
            q.setQuestionOrder(qdto.getQuestionOrder());
            q.setGroup(group);
            q.setImageUrl(qdto.getImageUrl());
            q.setAudioUrl(qdto.getAudioUrl());
            // Nếu muốn gán part cho từng câu hỏi:
            q.setPart(group.getPart());

            // Tạo option
            List<Option> optionList = new ArrayList<>();
            if (qdto.getOptions() != null) {
                for (OptionRequestDTO odto : qdto.getOptions()) {
                    Option o = new Option();
                    o.setLabel(odto.getOptionLabel());
                    o.setContent(odto.getOptionText());
                    o.setQuestion(q);
                    optionList.add(o);
                }
            }
            q.setOptions(optionList);
            questionList.add(q);
        }

        group.setQuestions(questionList);

        // Cascade ALL nên chỉ cần save group là đủ
        return groupRepo.save(group);
    }
}
