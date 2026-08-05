package com.quizapp.model.enums;

/**
 * Statut d'une session de quiz live.
 */
public enum StatutSessionEnum {
    EN_ATTENTE,   // Créée, en attente de participants
    EN_COURS,     // Session démarrée
    EN_PAUSE,     // Session mise en pause
    TERMINEE,     // Session terminée normalement
    ANNULEE       // Session annulée
}
