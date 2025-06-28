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
import java.sql.Timestamp;
import lombok.Data;

/**
 *
 * @author caong
 */
@Entity
@Data
public class UserResult {
    @Id @GeneratedValue
    private Long resultId;

    private Integer scoreListen;
    private Integer scoreRead;

    private Timestamp startedAt;
    private Timestamp finishedAt;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne @JoinColumn(name = "test_id")
    private Test test;
}

