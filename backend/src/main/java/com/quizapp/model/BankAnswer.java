package com.quizapp.model;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="bank_answers") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BankAnswer {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,columnDefinition="TEXT") private String texte;
    @Column(nullable=false) private Boolean correcte;
    @Column(length=2) private String option;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="question_id",nullable=false) @ToString.Exclude private BankQuestion question;
}
