/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.service;
import com.leenglish.toeic.dto.*;
import com.leenglish.toeic.domain.*;
import com.leenglish.toeic.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private QuestionTestRepository questionTestRepo;
    @Autowired
    private OptionRepository optionRepo;
    @Autowired
    private PartRepository partRepo;

    public QuestionGroup createGroupWithQuestions(QuestionGroupRequestDTO dto) {
        return createGroupWithQuestions(dto, null);
    }
    
    public QuestionGroup createGroupWithQuestions(QuestionGroupRequestDTO dto, User createdBy) {
        QuestionGroup group = new QuestionGroup();
        group.setTitle(dto.getTitle());
        group.setType(dto.getType());
        group.setContent(dto.getContent());
        group.setAudioUrl(dto.getAudioUrl());
        group.setImageUrl(dto.getImageUrl());
        group.setCreatedBy(createdBy); // Set the creator

        if (dto.getPartId() != null) {
            Part part = partRepo.findById(dto.getPartId()).orElse(null);
            group.setPart(part);
        }

        List<QuestionTest> questionList = new ArrayList<>();
        for (QuestionRequestDTO qdto : dto.getQuestions()) {
            QuestionTest q = new QuestionTest();
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
    
    @Transactional(readOnly = true)
    public List<QuestionGroup> getAllGroups() {
        return groupRepo.findAll();
    }
    
    @Transactional(readOnly = true)
    public List<QuestionGroup> getGroupsByPartId(Long partId) {
        return groupRepo.findByPart_PartId(partId);
    }
    
    @Transactional(readOnly = true)
    public List<QuestionGroup> getGroupsByUser(User user) {
        return groupRepo.findByCreatedBy(user);
    }
    
    @Transactional(readOnly = true)
    public QuestionGroup getGroupById(Long id) {
        return groupRepo.findById(id).orElse(null);
    }
    
    @Transactional
    public QuestionGroup updateGroup(Long id, QuestionGroupRequestDTO dto, User updatedBy) {
        QuestionGroup group = groupRepo.findById(id).orElse(null);
        if (group == null) {
            return null;
        }
        
        // Update basic fields
        group.setTitle(dto.getTitle());
        group.setType(dto.getType());
        group.setContent(dto.getContent());
        if (dto.getAudioUrl() != null) {
            group.setAudioUrl(dto.getAudioUrl());
        }
        if (dto.getImageUrl() != null) {
            group.setImageUrl(dto.getImageUrl());
        }
        
        // Update part if provided
        if (dto.getPartId() != null) {
            Part part = partRepo.findById(dto.getPartId()).orElse(null);
            group.setPart(part);
        }
        
        // Clear existing questions and recreate them (fix for Hibernate orphan removal)
        if (dto.getQuestions() != null && !dto.getQuestions().isEmpty()) {
            group.getQuestions().clear();
            for (QuestionRequestDTO qdto : dto.getQuestions()) {
                QuestionTest q = new QuestionTest();
                q.setQuestionText(qdto.getQuestionText());
                q.setCorrectOption(qdto.getCorrectOption());
                q.setQuestionOrder(qdto.getQuestionOrder());
                q.setGroup(group);
                q.setImageUrl(qdto.getImageUrl());
                q.setAudioUrl(qdto.getAudioUrl());
                if (group.getPart() != null) {
                    q.setPart(group.getPart());
                }
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
                group.getQuestions().add(q);
            }
        }
        
        return groupRepo.save(group);
    }
    
    @Transactional
    public void deleteGroup(Long id) {
        groupRepo.deleteById(id);
    }
}
