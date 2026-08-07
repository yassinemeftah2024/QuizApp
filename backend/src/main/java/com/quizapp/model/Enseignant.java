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

    @Column(length = 100)
    private String etablissement;

    @OneToMany(mappedBy = "enseignant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<QCM> qcms = new ArrayList<>();

    @ManyToMany(mappedBy = "enseignants", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<Classe> classes = new ArrayList<>();
}
