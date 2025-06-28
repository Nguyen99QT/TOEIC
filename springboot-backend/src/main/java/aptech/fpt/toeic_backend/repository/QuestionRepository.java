/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package aptech.fpt.toeic_backend.repository;

import aptech.fpt.toeic_backend.model.Question;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 *
 * @author caong
 */
public interface QuestionRepository extends JpaRepository<Question, Long>{
     List<Question> findByPartNumber(Integer partNumber);

    @Query(value = "SELECT * FROM question WHERE part_number = ?1 ORDER BY RAND() LIMIT ?2", nativeQuery = true)
    List<Question> findRandomByPartNumber(Integer partNumber, int limit);
}
