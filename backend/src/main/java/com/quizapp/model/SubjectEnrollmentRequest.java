package com.quizapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subject_enrollment_requests", uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "matiere_id"}))
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SubjectEnrollmentRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "student_id", nullable = false)
    private Etudiant student;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "matiere_id", nullable = false)
    private Matiere matiere;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "teacher_id")
    private Enseignant teacher;
    @Column(nullable = false, length = 20)
    private String status;
    @Builder.Default private LocalDateTime dateCreation = LocalDateTime.now();
}
