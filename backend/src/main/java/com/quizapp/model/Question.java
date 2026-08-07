package com.quizapp.model;

import com.quizapp.model.enums.TypeQuestionEnum;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Question — Question appartenant à un QCM.
 */
@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texte;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TypeQuestionEnum type = TypeQuestionEnum.QCM;

    /** Ordre d'affichage dans le QCM */
    @Column(nullable = false)
    @Builder.Default
    private Integer ordre = 1;

    /** Durée allouée pour répondre (en secondes) */
    @Column
    @Builder.Default
    private Integer dureeSecondes = 30;

    /** Points attribués si bonne réponse */
    @Column
    @Builder.Default
    private Integer points = 100;

    /** Explication affichée après la réponse */
    @Column(columnDefinition = "TEXT")
    private String explication;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qcm_id", nullable = false)
    @ToString.Exclude
    private QCM qcm;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Reponse> reponses = new ArrayList<>();
}
