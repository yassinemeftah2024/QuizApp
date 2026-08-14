package com.quizapp.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainingResultDTO {
    private Long attemptId; private Long quizId; private String quizTitre; private Integer score; private Integer scoreMaximum;
    private Integer bonnesReponses; private Integer totalQuestions; private Double pourcentage; private LocalDateTime dateTentative;
    private List<TrainingQuestionResultDTO> questions;
}
