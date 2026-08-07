package com.quizapp.dto;

import com.quizapp.model.enums.ModeQuizEnum;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Objet reçu quand l'enseignant veut créer une session.
 * On utilise un DTO au lieu de l'entité directement (bonne pratique).
 */
@Data
public class CreateSessionRequest {

    @NotNull(message = "L'ID du QCM est obligatoire")
    private Long qcmId;

    @NotNull(message = "L'ID de l'enseignant est obligatoire")
    private Long createdBy;

    @NotNull(message = "Le mode du quiz est obligatoire")
    private ModeQuizEnum mode;

    private Integer nombreMaxParticipants; // optionnel
}
