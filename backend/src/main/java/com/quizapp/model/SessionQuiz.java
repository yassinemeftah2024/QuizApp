package com.quizapp.model;

import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.model.enums.StatutSessionEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_quiz")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code_pin", nullable = false, unique = true, length = 6)
    private String codePIN;

    @Column(name = "qr_code_token", nullable = false, unique = true)
    private String qrCodeToken;

    @Column(name = "date_debut_planifiee")
    private LocalDateTime dateDebutPlanifiee;

    @Column(name = "date_debut_reelle")
    private LocalDateTime dateDebutReelle;

    @Column(name = "date_fin")
    private LocalDateTime dateFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutSessionEnum statut;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ModeQuizEnum mode;

    @Column(name = "nombre_max_participants")
    private Integer nombreMaxParticipants;

    // ========== LIEN AVEC LE QCM ==========
    @Column(name = "qcm_id", nullable = false)
    private Long qcmId;

    // Relation demandée par dev-a
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qcm_id", insertable = false, updatable = false)
    private QCM qcm;

    // ========== QUI A CRÉÉ LA SESSION ==========
    @Column(name = "created_by", nullable = false)
    private Long createdBy;

    // ========== INDEX DE LA QUESTION EN COURS ==========
    @Column(name = "current_question_index")
    @Builder.Default
    private Integer currentQuestionIndex = 0;

    @PrePersist
    protected void onCreate() {
        if (this.statut == null) {
            this.statut = StatutSessionEnum.PLANIFIEE;
        }
        if (this.currentQuestionIndex == null) {
            this.currentQuestionIndex = 0;
        }
    }
}