package com.quizapp.service;

import com.quizapp.dto.ChangePasswordRequest;
import com.quizapp.dto.ProfileResponse;
import com.quizapp.dto.UpdateProfileRequest;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ConflictException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Utilisateur;
import com.quizapp.model.Etudiant;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    /** Maximum file size: 2 MB */
    private static final long MAX_PHOTO_SIZE = 2 * 1024 * 1024;
    /** Allowed MIME types */
    private static final String[] ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"};

    /** Récupère l'utilisateur actuellement authentifié depuis le contexte Spring Security */
    private Utilisateur getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    public ProfileResponse getMyProfile() {
        Utilisateur user = getCurrentUser();
        return buildProfileResponse(user);
    }

    private ProfileResponse buildProfileResponse(Utilisateur user) {
        ProfileResponse.ProfileResponseBuilder response = ProfileResponse.builder()
                .id(user.getId())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole().getNom().name())
                .avatarAnimal(user.getAvatarAnimal())
                .photoBase64(user.getPhotoBase64())
                .dateCreation(user.getDateCreation())
                .dateDerniereConnexion(user.getDateDerniereConnexion());
        if (user instanceof Etudiant student && student.getClasse() != null) {
            response.classeId(student.getClasse().getId())
                    .classeNom(student.getClasse().getNom())
                    .classeNiveau(student.getClasse().getNiveau())
                    .classeSection(student.getClasse().getSection());
        }
        return response.build();
    }

    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        Utilisateur user = getCurrentUser();

        // Vérifie si le nouvel email n'est pas déjà pris par quelqu'un d'autre
        if (!user.getEmail().equals(request.getEmail())) {
            utilisateurRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
                throw new ConflictException("Cet email est déjà utilisé par un autre compte.");
            });
        }

        user.setNom(request.getNom());
        user.setPrenom(request.getPrenom());
        user.setEmail(request.getEmail());
        // L'avatar (animal) est optionnel : on ne l'écrase que s'il est fourni.
        if (request.getAvatarAnimal() != null && !request.getAvatarAnimal().isBlank()) {
            user.setAvatarAnimal(request.getAvatarAnimal().trim());
        }
        utilisateurRepository.save(user);

        return getMyProfile();
    }

    @Transactional
    public ProfileResponse uploadPhoto(MultipartFile file) {
        Utilisateur user = getCurrentUser();

        if (file == null || file.isEmpty()) {
            throw new BusinessException("Aucun fichier fourni.");
        }

        if (file.getSize() > MAX_PHOTO_SIZE) {
            throw new BusinessException("La taille du fichier dépasse 2 Mo.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !java.util.Arrays.asList(ALLOWED_MIME_TYPES).contains(contentType)) {
            throw new BusinessException("Format d'image non supporté. Utilisez JPEG, PNG ou WebP.");
        }

        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String dataUrl = "data:" + contentType + ";base64," + base64;
            user.setPhotoBase64(dataUrl);
            utilisateurRepository.save(user);
        } catch (IOException ex) {
            throw new BusinessException("Erreur lors de la lecture du fichier : " + ex.getMessage());
        }

        return buildProfileResponse(user);
    }

    @Transactional
    public void deletePhoto() {
        Utilisateur user = getCurrentUser();
        user.setPhotoBase64(null);
        utilisateurRepository.save(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        Utilisateur user = getCurrentUser();

        if (!passwordEncoder.matches(request.getAncienMotDePasse(), user.getMotDePasse())) {
            throw new BusinessException("L'ancien mot de passe est incorrect.");
        }

        user.setMotDePasse(passwordEncoder.encode(request.getNouveauMotDePasse()));
        utilisateurRepository.save(user);
    }
}
