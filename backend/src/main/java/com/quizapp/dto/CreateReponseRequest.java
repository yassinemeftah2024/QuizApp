package com.quizapp.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateReponseRequest {
    @NotBlank(message = "Answer text is required")
    private String texte;
    private Boolean correcte = false;
    private String option;
}
