package com.quizapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClasseDTO {
    
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @Size(max = 50)
    private String niveau; // Ex: Terminale, 1ère, 2ème année BTS...

    @Size(max = 50)
    private String section;

    @Size(max = 50)
    private String anneeAcademique; // Ex: 2025-2026

    @Size(max = 500)
    private String description;

    private int nombreEtudiants;
}
