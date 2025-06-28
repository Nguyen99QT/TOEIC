/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package aptech.fpt.toeic_backend.repository;

import aptech.fpt.toeic_backend.model.Option;
import aptech.fpt.toeic_backend.model.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author caong
 */
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findByQuestion(Question question);
}
