package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Reponse — Proposition de réponse pour une Question.
 * Une question QCM a généralement 4 réponses (A, B, C, D).
 */
@Entity
@Table(name = "reponses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String texte;

    /** Indique si c'est la bonne réponse */
    @Column(nullable = false)
    @Builder.Default
    private Boolean correcte = false;

    /** Lettre d'option : A, B, C, D */
    @Column(length = 1)
    private String option;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    @ToString.Exclude
    private Question question;
}
