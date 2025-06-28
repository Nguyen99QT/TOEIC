/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Data
public class Question {

    @Id
    @GeneratedValue
    private Long questionId;

    private String questionText;
    private String imageUrl;
    private String audioUrl;
    private String correctOption;
    private Integer questionOrder;

    private Integer partNumber;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private QuestionGroup group;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Option> options;
    @ManyToOne
    @JoinColumn(name = "part_id")
    private Part part;
}
