/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Data
public class UserAnswer {
    @Id @GeneratedValue
    private Long answerId;

    private String selectedOption;

    @ManyToOne @JoinColumn(name = "result_id")
    private UserResult result;

    @ManyToOne @JoinColumn(name = "question_id")
    private Question question;
}
