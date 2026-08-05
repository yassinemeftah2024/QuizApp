package com.quizapp.model.enums;

/**
 * Modes de fonctionnement d'un QCM.
 */
public enum ModeQuizEnum {
    /** Session en direct avec PIN, contrôlée par l'enseignant. */
    LIVE,
    /** Mode auto-guidé, sans contrainte de temps. */
    ENTRAINEMENT,
    /** Mode examen avec limite de temps et une seule tentative. */
    EXAMEN,
    /** Mode compétitif avec classement en temps réel. */
    DEFI
}
