package com.quizapp.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="question_categories", uniqueConstraints=@UniqueConstraint(columnNames={"enseignant_id","nom"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuestionCategory {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=100) private String nom;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="enseignant_id",nullable=false) @ToString.Exclude private Enseignant enseignant;
}
