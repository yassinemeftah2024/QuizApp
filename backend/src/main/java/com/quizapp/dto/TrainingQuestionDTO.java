package com.quizapp.dto;
import com.quizapp.model.enums.TypeQuestionEnum;
import lombok.*;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class TrainingQuestionDTO {
    private Long id; private String texte; private TypeQuestionEnum type; private Integer ordre;
    private Integer dureeSecondes; private Integer points; private String mediaUrl; private String mediaType; private String mediaAlt;
    private List<ReponseDTO> reponses;
}
