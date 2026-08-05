package com.quizapp.model;

import com.quizapp.model.enums.StatutSessionEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * SessionQuiz — Session live créée par un Enseignant.
 * Accessible via un PIN à 6 chiffres ou QR Code.
 * Gérée via WebSocket (dev-b).
 */
@Entity
@Table(name = "sessions_quiz")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** PIN à 6 chiffres pour rejoindre (ex: 742156) */
    @Column(nullable = false, unique = true, length = 6)
    private String pinCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatutSessionEnum statut = StatutSessionEnum.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qcm_id", nullable = false)
    @ToString.Exclude
    private QCM qcm;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enseignant_id", nullable = false)
    @ToString.Exclude
    private Enseignant enseignant;

    /** Index de la question actuellement affichée (0-based) */
    @Column(nullable = false)
    @Builder.Default
    private Integer questionCourante = 0;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column
    private LocalDateTime dateDemarrage;

    @Column
    private LocalDateTime dateFin;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Participation> participations = new ArrayList<>();

    @OneToMany(mappedBy = "sessionJointe", cascade = CascadeType.ALL)
    @ToString.Exclude
    private List<Invite> invites = new ArrayList<>();
}
