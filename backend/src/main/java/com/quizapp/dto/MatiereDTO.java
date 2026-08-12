package com.quizapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MatiereDTO {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @NotBlank(message = "Le code est obligatoire")
    @Size(max = 20)
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Le code doit être en majuscules sans espaces")
    private String code;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6})$", message = "La couleur doit être un code hexadécimal valide (ex: #6366f1)")
    private String couleur;

    @Size(max = 255)
    private String description;
}
