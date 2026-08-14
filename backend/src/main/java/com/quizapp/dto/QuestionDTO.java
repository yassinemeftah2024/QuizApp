package com.quizapp.dto;

import com.quizapp.model.enums.TypeQuestionEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class QuestionDTO {
    private Long id;
    private String texte;
    private TypeQuestionEnum type;
    private Integer ordre;
    private Integer dureeSecondes;
    private Integer points;
    private String explication;
    private String mediaUrl;
    private String mediaType;
    private String mediaAlt;
    private List<ReponseDTO> reponses;
}
