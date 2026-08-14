package com.quizapp.dto;

import com.quizapp.model.enums.RoleEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private RoleEnum role;
}
