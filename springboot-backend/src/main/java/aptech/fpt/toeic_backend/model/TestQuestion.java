/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Table(name = "test_question")
@Data
public class TestQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "test_id", nullable = false)
    private Test test;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "part_number", nullable = false)
    private Integer partNumber;

    @Column(name = "question_order")
    private Integer questionOrder;

    // Constructors
    public TestQuestion() {}

    public TestQuestion(Test test, Question question, Integer partNumber, Integer questionOrder) {
        this.test = test;
        this.question = question;
        this.partNumber = partNumber;
        this.questionOrder = questionOrder;
    }
}
