package com.quizapp.service;

import com.quizapp.dto.AuthResponse;
import com.quizapp.dto.LoginRequest;
import com.quizapp.dto.RefreshTokenRequest;
import com.quizapp.dto.RegisterRequest;
import com.quizapp.exception.ApiException;
import com.quizapp.exception.ConflictException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Etudiant;
import com.quizapp.model.Role;
import com.quizapp.model.Utilisateur;
import com.quizapp.model.enums.RoleEnum;
import com.quizapp.repository.ClasseRepository;
import com.quizapp.repository.RoleRepository;
import com.quizapp.repository.UtilisateurRepository;
import com.quizapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final ClasseRepository classeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotDePasse()
                )
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        utilisateur.setDateDerniereConnexion(LocalDateTime.now());
        utilisateurRepository.save(utilisateur);

        var accessToken = jwtService.generateToken(utilisateur);
        var refreshToken = jwtService.generateRefreshToken(utilisateur);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole().getNom())
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("L'email est déjà utilisé");
        }

        // Public registration only allows ETUDIANT role.
        // ADMIN and ENSEIGNANT must be created by admins via /admin/users endpoint.
        if (request.getRole() != RoleEnum.ETUDIANT) {
            throw new ApiException(HttpStatus.FORBIDDEN,
                    "L'inscription publique est réservée aux étudiants. Les enseignants et administrateurs sont créés par l'administration.");
        }

        Role role = roleRepository.findByNom(RoleEnum.ETUDIANT)
                .orElseThrow(() -> new ResourceNotFoundException("Rôle ETUDIANT introuvable"));

        if (request.getClasseId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "La classe est requise pour l'inscription étudiant");
        }
        var classe = classeRepository.findById(request.getClasseId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable"));

        var etudiant = new Etudiant();
        etudiant.setClasse(classe);
        etudiant.setNom(request.getNom());
        etudiant.setPrenom(request.getPrenom());
        etudiant.setEmail(request.getEmail());
        etudiant.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        etudiant.setRole(role);
        etudiant.setActif(true);
        etudiant.setDateCreation(LocalDateTime.now());

        Utilisateur savedUser = utilisateurRepository.save(etudiant);

        var accessToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .id(savedUser.getId())
                .nom(savedUser.getNom())
                .prenom(savedUser.getPrenom())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().getNom())
                .build();
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String userEmail = jwtService.extractUsername(refreshToken);

        if (userEmail != null && jwtService.isRefreshToken(refreshToken)) {
            Utilisateur utilisateur = utilisateurRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));

            if (jwtService.isTokenValid(refreshToken, utilisateur)) {
                var newAccessToken = jwtService.generateToken(utilisateur);
                return AuthResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .id(utilisateur.getId())
                        .nom(utilisateur.getNom())
                        .prenom(utilisateur.getPrenom())
                        .email(utilisateur.getEmail())
                        .role(utilisateur.getRole().getNom())
                        .build();
            }
        }
        throw new ApiException(HttpStatus.UNAUTHORIZED, "Refresh token invalide");
    }
}
