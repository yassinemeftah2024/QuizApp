package com.quizapp.controller;

import com.quizapp.dto.*;
import com.quizapp.service.AdminService;
import com.quizapp.service.UserImportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * AdminController — CRUD utilisateurs + stats dashboard.
 * Toutes les routes sont protégées par @PreAuthorize("hasRole('ADMIN')").
 * Note: Spring Security mappe /admin/** -> hasRole("ADMIN") (voir SecurityConfig).
 */
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserImportService userImportService;

    // ── Dashboard Stats ───────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    // ── Users CRUD ────────────────────────────────────────────────────

    @GetMapping("/users")
    public ResponseEntity<List<UtilisateurDTO>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UtilisateurDTO> createUser(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.createUser(request));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<UtilisateurDTO> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.toggleStatus(id));
    }

    @PutMapping("/users/{id}/teacher-assignments")
    public ResponseEntity<UtilisateurDTO> updateTeacherAssignments(
            @PathVariable Long id,
            @RequestBody TeacherAssignmentsRequest request) {
        return ResponseEntity.ok(adminService.updateTeacherAssignments(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ── Import Excel ──────────────────────────────────────────────────

    /**
     * Import en masse d'utilisateurs depuis un fichier Excel.
     * Colonnes : prénom | nom | email | rôle | mot de passe (1re ligne = en-tête).
     * Renvoie un rapport (créés / échecs + détail par ligne).
     */
    @PostMapping(value = "/users/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserImportResultDTO> importUsers(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userImportService.importUsers(file));
    }

    /** Télécharge un modèle Excel prêt à remplir pour l'import d'utilisateurs. */
    @GetMapping("/users/import/template")
    public ResponseEntity<Resource> downloadImportTemplate() {
        byte[] bytes = userImportService.buildTemplate();
        ByteArrayResource resource = new ByteArrayResource(bytes);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"modele-import-utilisateurs.xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .contentLength(bytes.length)
                .body(resource);
    }
}
