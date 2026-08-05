package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Badge — Récompense de gamification pour les étudiants.
 * Ex: "Accuracy Master", "Quiz Champion", "Speed Demon".
 */
@Entity
@Table(name = "badges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nom; // "Accuracy Master", "Speed Demon"...

    @Column(columnDefinition = "TEXT")
    private String description; // "95% accuracy on 10 quizzes"

    /** Icône ou emoji représentant le badge */
    @Column(length = 50)
    private String icone;

    /** Couleur thème du badge (hex) */
    @Column(length = 7)
    private String couleur;

    /** Condition d'obtention en JSON ou description libre */
    @Column(columnDefinition = "TEXT")
    private String conditionObtention;
}
