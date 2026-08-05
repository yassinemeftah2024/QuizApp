package com.quizapp.model.enums;

/**
 * Statut d'un document soumis pour traitement IA.
 */
public enum StatutDocumentEnum {
    EN_ATTENTE,  // Document uploadé, traitement non démarré
    EN_COURS,    // Traitement IA en cours
    TRAITE,      // Document traité avec succès
    ERREUR       // Erreur lors du traitement
}
