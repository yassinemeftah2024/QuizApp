package com.quizapp.dto;

import com.quizapp.model.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private RoleEnum role;
    private String avatarAnimal;
    private boolean actif;
    private LocalDateTime dateCreation;
    private List<Long> matiereIds;
    private List<String> matiereNoms;
    private List<Long> classeIds;
    private List<String> classeNoms;
    private Long classeId;
    private String classeNom;
}
