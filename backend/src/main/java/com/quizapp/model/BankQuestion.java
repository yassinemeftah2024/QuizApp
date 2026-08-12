package com.quizapp.model;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.TypeQuestionEnum;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Entity @Table(name="bank_questions") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class BankQuestion {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,columnDefinition="TEXT") private String texte;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private TypeQuestionEnum type;
    @Enumerated(EnumType.STRING) @Column(nullable=false) @Builder.Default private DifficulteEnum difficulte=DifficulteEnum.MOYEN;
    @Column private Integer dureeSecondes=30; @Column private Integer points=100; @Column(columnDefinition="TEXT") private String explication;
    @Column(length=1000) private String mediaUrl; @Column(length=20) private String mediaType; @Column(length=255) private String mediaAlt;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="enseignant_id",nullable=false) @ToString.Exclude private Enseignant enseignant;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="matiere_id") @ToString.Exclude private Matiere matiere;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="categorie_id") @ToString.Exclude private QuestionCategory categorie;
    @OneToMany(mappedBy="question",cascade=CascadeType.ALL,orphanRemoval=true) @Builder.Default @ToString.Exclude private List<BankAnswer> reponses=new ArrayList<>();
    @Column(nullable=false,updatable=false) @Builder.Default private LocalDateTime dateCreation=LocalDateTime.now();
}
