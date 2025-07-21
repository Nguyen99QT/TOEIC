/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.leenglish.toeic.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;

/**
 *
 * @author caong
 */
@Entity
public class Part {
    @Id @GeneratedValue
    private Long partId;

    private int partNumber;
    private String instructions;

    @ManyToOne @JoinColumn(name = "test_id")
    private Test test;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL)
    private List<QuestionTest> questions;

    @OneToMany(mappedBy = "part", cascade = CascadeType.ALL)
    private List<QuestionGroup> groups;
}