package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Etudiant — sous-classe de Utilisateur (héritage JOINED).
 * Participe aux quiz, accumule des points et badges (gamification).
 * Interface MOBILE-FIRST (responsive).
 */
@Entity
@Table(name = "etudiants")
@DiscriminatorValue("ETUDIANT")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Etudiant extends Utilisateur {

    @Column(length = 100)
    private String niveau; // Grade 10, Grade 11, etc.

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classe_id")
    @ToString.Exclude
    private Classe classe;

    @Column(nullable = false)
    private Integer totalPoints = 0;

    @Column(nullable = false)
    private Integer totalQuizComplete = 0;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Participation> participations = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "etudiant_badges",
        joinColumns = @JoinColumn(name = "etudiant_id"),
        inverseJoinColumns = @JoinColumn(name = "badge_id")
    )
    @ToString.Exclude
    private List<Badge> badges = new ArrayList<>();
}
