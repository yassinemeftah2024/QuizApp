package com.quizapp.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private String avatarAnimal;
    private String photoBase64; // Optional profile photo as base64 data URL
    private LocalDateTime dateCreation;
    private LocalDateTime dateDerniereConnexion;
    private Long classeId;
    private String classeNom;
    private String classeNiveau;
    private String classeSection;
}
