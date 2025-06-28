/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package aptech.fpt.toeic_backend.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;
/**
 *
 * @author caong
 */
@Entity
@Data
public class QuestionGroup {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long groupId;

    private String title;        
    private String description;  
    private String type;          

    @Lob
    private String content;       
    private String audioUrl;     
    private String imageUrl;     

    @ManyToOne 
    @JoinColumn(name = "part_id")
    private Part part;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

}
