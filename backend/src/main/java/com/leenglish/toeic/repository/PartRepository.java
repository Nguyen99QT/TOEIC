/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leenglish.toeic.domain.Part;

/**
 *
 * @author caong
 */
public interface PartRepository extends JpaRepository<Part, Long>{
    
}
