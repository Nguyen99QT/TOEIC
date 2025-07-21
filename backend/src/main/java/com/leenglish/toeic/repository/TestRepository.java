/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.leenglish.toeic.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leenglish.toeic.domain.Test;

/**
 *
 * @author caong
 */
public interface TestRepository extends JpaRepository<Test, Long>{
    
}
