package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

/**
 * Matiere — Discipline enseignée (ex: Mathématiques, Physique, Histoire).
 */
@Entity
@Table(name = "matieres")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Matiere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String nom;

    @Column(nullable = false, unique = true, length = 20)
    private String code; // Ex: MATH, PHYS, HIST

    @Column(length = 7)
    @Builder.Default
    private String couleur = "#6366f1"; // Couleur hex pour l'UI (ex: #6366f1)

    @Column(length = 255)
    private String description;
}
