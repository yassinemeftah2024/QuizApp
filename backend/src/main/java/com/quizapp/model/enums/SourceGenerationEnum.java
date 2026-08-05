package com.quizapp.model.enums;

/**
 * Source de génération d'un QCM ou d'une question.
 */
public enum SourceGenerationEnum {
    MANUEL,   // Créé manuellement par l'enseignant
    IA,       // Généré via IA (dev-a feature)
    IMPORT    // Importé depuis un fichier (PDF, CSV, etc.)
}
