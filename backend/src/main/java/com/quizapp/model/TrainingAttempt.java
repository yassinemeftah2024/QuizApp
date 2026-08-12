package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "training_attempts") @Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrainingAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false) @ToString.Exclude private Etudiant student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "qcm_id", nullable = false) @ToString.Exclude private QCM qcm;
    @Column(nullable = false) private Integer score;
    @Column(nullable = false) private Integer scoreMaximum;
    @Column(nullable = false) private Integer bonnesReponses;
    @Column(nullable = false) private Integer totalQuestions;
    @Column(nullable = false) private Double pourcentage;
    @Column(nullable = false, updatable = false) @Builder.Default private LocalDateTime dateTentative = LocalDateTime.now();
}
