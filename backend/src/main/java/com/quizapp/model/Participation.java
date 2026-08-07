package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "participation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String pseudonyme;

    // ========== LIEN AVEC LA SESSION ==========
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    // ========== LIEN AVEC L'ÉTUDIANT (pour coller avec dev-a) ==========
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;          // ← nouveau champ demandé par dev-a

    // ========== LIEN AVEC L'UTILISATEUR (optionnel - pour les invités) ==========
    @Column(name = "utilisateur_id")
    private Long utilisateurId;

    // ========== DATES ==========
    @Column(name = "date_debut", nullable = false)
    private LocalDateTime dateDebut;

    // ========== SCORE ET CLASSEMENT ==========
    @Column(name = "score_total")
    @Builder.Default
    private Double scoreTotal = 0.0;

    @Column(name = "temps_total")
    @Builder.Default
    private Long tempsTotal = 0L;

    @Column(name = "rang_final")
    private Integer rangFinal;

    @Column(nullable = false)
    @Builder.Default
    private boolean terminee = false;

    @PrePersist
    protected void onCreate() {
        this.dateDebut = LocalDateTime.now();
        if (this.scoreTotal == null) {
            this.scoreTotal = 0.0;
        }
        if (this.tempsTotal == null) {
            this.tempsTotal = 0L;
        }
    }
}