package com.quizapp.model.enums;

/**
 * Types de questions supportés dans un QCM.
 */
public enum TypeQuestionEnum {
    QCM,          // Question à choix multiple (une ou plusieurs bonnes réponses)
    VRAI_FAUX,    // Question vrai/faux binaire
    TEXTE_LIBRE   // Réponse ouverte saisie par l'étudiant
}
