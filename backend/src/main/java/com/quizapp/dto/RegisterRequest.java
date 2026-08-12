package com.quizapp.dto;

import com.quizapp.model.enums.RoleEnum;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "Le prénom est requis")
    private String prenom;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String motDePasse;

    @NotNull(message = "Le rôle est requis")
    private RoleEnum role;

    // Champs optionnels selon le rôle
    private Long classeId; // Pour ETUDIANT
    private String matiere; // Pour ENSEIGNANT
    private List<Long> matiereIds = new ArrayList<>(); // Pour ENSEIGNANT
    private List<Long> classeIds = new ArrayList<>(); // Pour ENSEIGNANT
    private String etablissement; // Pour ENSEIGNANT
    private String departement; // Pour ADMIN
}
