package com.quizapp.model;

import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.SourceGenerationEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * QCM — Quiz à Choix Multiple.
 * Créé par un Enseignant, peut être généré via IA ou manuellement.
 */
@Entity
@Table(name = "qcms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QCM {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 100)
    private String matiere; // Biology, Mathematics, Physics...

    @Column(length = 50)
    private String niveau; // Grade 9, Grade 10...

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DifficulteEnum difficulte = DifficulteEnum.MOYEN;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matiere_id")
    @ToString.Exclude
    private Matiere matiereRef;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "qcm_classes",
        joinColumns = @JoinColumn(name = "qcm_id"),
        inverseJoinColumns = @JoinColumn(name = "classe_id")
    )
    @ToString.Exclude
    @Builder.Default
    private List<Classe> classes = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModeQuizEnum mode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SourceGenerationEnum source = SourceGenerationEnum.MANUEL;

    /** Durée totale du quiz en minutes */
    @Column
    private Integer dureeMinutes;

    @Column(nullable = false)
    @Builder.Default
    private Boolean publie = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean archive = false;

    /** Mélange l'ordre des questions à chaque session */
    @Builder.Default
    private Boolean shuffleQuestions = false;

    /** Afficher les explications après chaque question */
    @Builder.Default
    private Boolean showExplanations = false;

    /** Autoriser les tentatives multiples */
    @Builder.Default
    private Boolean allowRetakes = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean disponibleEntrainement = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id", nullable = false)
    @ToString.Exclude
    private Enseignant enseignant;

    @OneToMany(mappedBy = "qcm", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("ordre ASC")
    @ToString.Exclude
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @OneToMany(mappedBy = "qcm", cascade = CascadeType.ALL)
    @ToString.Exclude
    @Builder.Default
    private List<SessionQuiz> sessions = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column
    private LocalDateTime dateModification;

    @PreUpdate
    public void preUpdate() {
        dateModification = LocalDateTime.now();
    }
}
