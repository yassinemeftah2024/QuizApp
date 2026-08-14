package com.quizapp.dto;

import com.quizapp.model.enums.TypeQuestionEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateQuestionRequest {
    @NotBlank(message = "Question text is required")
    private String texte;
    @NotNull(message = "Question type is required")
    private TypeQuestionEnum type;
    private Integer ordre;
    private Integer dureeSecondes = 30;
    private Integer points = 100;
    private String explication;
    private String mediaUrl;
    private String mediaType;
    private String mediaAlt;
    @Valid
    private List<CreateReponseRequest> reponses = new ArrayList<>();
}
