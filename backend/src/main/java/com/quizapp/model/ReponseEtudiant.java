package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Représente la réponse d'un joueur à une question précise.
 * Correspond à la classe ReponseEtudiant du diagramme de classes.
 */
@Entity
@Table(name = "reponse_etudiant")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReponseEtudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ========== LIENS ==========
    @Column(name = "participation_id", nullable = false)
    private Long participationId;          // Qui a répondu

    @Column(name = "question_id", nullable = false)
    private Long questionId;               // À quelle question

    @Column(name = "session_id", nullable = false)
    private Long sessionId;                // Dans quelle session

    // ========== CHOIX SÉLECTIONNÉS ==========
    // Pour les questions à choix multiple, on peut avoir plusieurs IDs
    @ElementCollection
    @CollectionTable(
            name = "reponse_etudiant_choix",
            joinColumns = @JoinColumn(name = "reponse_etudiant_id")
    )
    @Column(name = "choix_id")
    @Builder.Default
    private List<Long> choixSelectionnes = new ArrayList<>();

    // ========== TEMPS DE RÉPONSE ==========
    @Column(name = "temps_reponse")
    private Integer tempsReponse;          // en millisecondes

    // ========== SCORE ==========
    @Column(name = "score_obtenu")
    private Double scoreObtenu = 0.0;

    // ========== EST-CE CORRECT ? ==========
    @Column(name = "est_correcte")
    private boolean estCorrecte = false;
}