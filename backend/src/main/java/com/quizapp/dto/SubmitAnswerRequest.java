package com.quizapp.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class SubmitAnswerRequest {

    @NotNull(message = "L'ID de la participation est obligatoire")
    private Long participationId;

    @NotNull(message = "L'ID de la question est obligatoire")
    private Long questionId;

    @NotNull(message = "L'ID de la session est obligatoire")
    private Long sessionId;

    private List<Long> choixSelectionnes;

    private Integer tempsReponse;

    private Double scoreObtenu;

    private Boolean estCorrecte;
}