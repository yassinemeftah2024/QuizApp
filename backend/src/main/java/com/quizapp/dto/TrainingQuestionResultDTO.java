package com.quizapp.dto;
import lombok.*;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainingQuestionResultDTO {
    private Long questionId; private Boolean correcte; private Integer pointsObtenus; private List<Long> bonnesReponseIds; private String explication;
}
