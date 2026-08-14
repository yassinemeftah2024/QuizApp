package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Résultat d'un import Excel d'utilisateurs.
 * Renvoie le nombre de lignes créées et le détail des lignes en erreur,
 * afin que l'admin puisse corriger le fichier et réimporter.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserImportResultDTO {

    /** Nombre total de lignes de données lues (hors en-tête). */
    private int totalRows;

    /** Nombre d'utilisateurs créés avec succès. */
    private int created;

    /** Nombre de lignes rejetées. */
    private int failed;

    /** Détail des lignes en erreur (numéro de ligne + motif). */
    @Builder.Default
    private List<RowError> errors = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RowError {
        /** Numéro de ligne dans le fichier (1-based, tel qu'affiché dans Excel). */
        private int row;
        private String message;
    }
}
