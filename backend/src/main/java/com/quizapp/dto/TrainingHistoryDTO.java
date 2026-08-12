package com.quizapp.dto;
import lombok.*;
import java.time.LocalDateTime;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainingHistoryDTO {
    private Long attemptId; private Long quizId; private String quizTitre; private String matiere; private Integer score; private Integer scoreMaximum;
    private Double pourcentage; private Integer bonnesReponses; private Integer totalQuestions; private LocalDateTime dateTentative;
}
