package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Participation — Résultat d'un Etudiant à une SessionQuiz.
 * Enregistre le score, la précision, le rang final et le temps.
 */
@Entity
@Table(name = "participations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id", nullable = false)
    @ToString.Exclude
    private Etudiant etudiant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    @ToString.Exclude
    private SessionQuiz session;

    @Column(nullable = false)
    @Builder.Default
    private Integer score = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer bonnesReponses = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer mauvaisesReponses = 0;

    /** Précision en % (0-100) */
    @Column
    private Double precision;

    /** Rang dans la session */
    @Column
    private Integer rang;

    /** Durée totale de participation en secondes */
    @Column
    private Integer dureeSecondes;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateParticipation = LocalDateTime.now();
}
