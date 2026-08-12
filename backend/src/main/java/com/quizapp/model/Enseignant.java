package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Enseignant — sous-classe de Utilisateur (héritage JOINED).
 * Crée et gère les QCMs, lance les sessions live.
 */
@Entity
@Table(name = "enseignants")
@DiscriminatorValue("ENSEIGNANT")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class Enseignant extends Utilisateur {

    @Column(length = 100)
    private String matiere;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "enseignant_matieres",
        joinColumns = @JoinColumn(name = "enseignant_id"),
        inverseJoinColumns = @JoinColumn(name = "matiere_id")
    )
    @ToString.Exclude
    private List<Matiere> matieres = new ArrayList<>();

    @Column(length = 100)
    private String etablissement;

    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<QCM> qcms = new ArrayList<>();

    @ManyToMany(mappedBy = "enseignants", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Classe> classes = new ArrayList<>();
}
