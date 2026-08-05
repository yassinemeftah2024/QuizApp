package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Invite — Participant invité sans compte (Guest).
 * Rejoint une session live via PIN, interface MOBILE-FIRST.
 * Partage certaines vues avec Etudiant (JoinQuiz, LiveQuestion, QuizResults).
 * N'a PAS d'historique, profil ou badges persistants.
 */
@Entity
@Table(name = "invites")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Pseudo choisi lors du join, stocké temporairement. */
    @Column(nullable = false, length = 100)
    private String pseudoNom;

    /** Email optionnel pour sauvegarder la progression. */
    @Column(length = 150)
    private String emailOptionnel;

    /** Animal buddy sélectionné (Lion, Tiger, Eagle...) */
    @Column(length = 50)
    private String avatarAnimal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    @ToString.Exclude
    private SessionQuiz sessionJointe;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateJoin = LocalDateTime.now();
}
