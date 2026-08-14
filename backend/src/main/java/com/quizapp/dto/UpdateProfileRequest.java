package com.quizapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 100)
    private String nom;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 100)
    private String prenom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Format email invalide")
    @Size(max = 150)
    private String email;

    /** Avatar animal choisi (optionnel). Ex. "Lion", "Panda"… */
    @Size(max = 50)
    private String avatarAnimal;
}
