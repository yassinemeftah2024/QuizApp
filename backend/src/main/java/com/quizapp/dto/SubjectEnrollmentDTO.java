package com.quizapp.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class SubjectEnrollmentDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long matiereId;
    private String matiereNom;
    private String status;
}
