package com.quizapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * Objet reçu quand un joueur veut rejoindre une session.
 */
@Data
public class JoinSessionRequest {

    @NotNull(message = "L'ID de la session est obligatoire")
    private Long sessionId;

    @NotBlank(message = "Le pseudonyme est obligatoire")
    @Size(min = 2, max = 50, message = "Le pseudonyme doit faire entre 2 et 50 caractères")
    private String pseudonyme;

    // Optionnel : null si c'est un invité
    private Long utilisateurId;
}