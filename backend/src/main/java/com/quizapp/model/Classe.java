package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Classe — Groupe d'étudiants géré par un ou plusieurs enseignants.
 */
@Entity
@Table(name = "classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Classe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 50)
    private String niveau; // Grade 10, Grade 11, etc.

    @Column(length = 50)
    private String anneeAcademique; // 2025-2026

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "classe_enseignants",
        joinColumns = @JoinColumn(name = "classe_id"),
        inverseJoinColumns = @JoinColumn(name = "enseignant_id")
    )
    @ToString.Exclude
    private List<Enseignant> enseignants = new ArrayList<>();

    @OneToMany(mappedBy = "classe", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Etudiant> etudiants = new ArrayList<>();
}
