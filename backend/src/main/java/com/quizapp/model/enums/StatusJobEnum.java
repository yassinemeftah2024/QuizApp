package com.quizapp.model.enums;

/**
 * Statut d'un job de traitement asynchrone (génération IA, exports, etc.).
 */
public enum StatusJobEnum {
    PENDING,   // En file d'attente
    RUNNING,   // En cours d'exécution
    DONE,      // Terminé avec succès
    FAILED     // Échec du job
}
