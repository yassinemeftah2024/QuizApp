package com.quizapp.controller;

import com.quizapp.dto.ChangePasswordRequest;
import com.quizapp.dto.ProfileResponse;
import com.quizapp.dto.UpdateProfileRequest;
import com.quizapp.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /** GET /api/profile/me — Retourne le profil de l'utilisateur connecté */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    /** PUT /api/profile/me — Met à jour nom, prénom, email, avatar animal */
    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateProfile(request));
    }

    /** POST /api/profile/me/photo — Upload de la photo de profil (max 2 Mo, JPEG/PNG/WebP) */
    @PostMapping(value = "/me/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProfileResponse> uploadPhoto(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(profileService.uploadPhoto(file));
    }

    /** DELETE /api/profile/me/photo — Supprime la photo de profil */
    @DeleteMapping("/me/photo")
    public ResponseEntity<ProfileResponse> deletePhoto() {
        profileService.deletePhoto();
        return ResponseEntity.ok(profileService.getMyProfile());
    }

    /** PUT /api/profile/me/password — Change le mot de passe */
    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(request);
        return ResponseEntity.ok().build();
    }
}
