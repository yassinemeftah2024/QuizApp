package com.quizapp.dto;
import com.quizapp.model.enums.DifficulteEnum;
import lombok.*;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainingQuizDTO {
    private Long id; private String titre; private String description; private String matiere; private String niveau;
    private DifficulteEnum difficulte; private Integer dureeMinutes; private Boolean allowRetakes; private List<TrainingQuestionDTO> questions;
}
