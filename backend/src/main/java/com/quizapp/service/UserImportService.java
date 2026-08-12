package com.quizapp.service;

import com.quizapp.dto.UserImportResultDTO;
import com.quizapp.exception.BusinessException;
import com.quizapp.model.Administrateur;
import com.quizapp.model.Enseignant;
import com.quizapp.model.Etudiant;
import com.quizapp.model.Role;
import com.quizapp.model.Utilisateur;
import com.quizapp.model.enums.RoleEnum;
import com.quizapp.repository.RoleRepository;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.Map;

/**
 * UserImportService — import en masse d'utilisateurs depuis un fichier Excel.
 *
 * Colonnes attendues (première ligne = en-tête, ignorée) :
 *   A: prénom | B: nom | C: email | D: rôle | E: mot de passe
 *
 * Le rôle accepte ETUDIANT / ENSEIGNANT / ADMIN (insensible à la casse) ;
 * vide → ETUDIANT par défaut. Les enseignants/admins sont créés sans
 * matières/classes (à assigner ensuite via l'écran d'administration).
 *
 * Chaque ligne est traitée indépendamment : une ligne invalide est signalée
 * dans le rapport sans interrompre l'import des autres.
 */
@Service
@RequiredArgsConstructor
public class UserImportService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private final DataFormatter dataFormatter = new DataFormatter();

    public UserImportResultDTO importUsers(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("Le fichier est vide.");
        }
        String name = file.getOriginalFilename();
        if (name != null && !(name.toLowerCase().endsWith(".xlsx") || name.toLowerCase().endsWith(".xls"))) {
            throw new BusinessException("Format non supporté. Fournissez un fichier Excel (.xlsx ou .xls).");
        }

        // Cache des rôles pour éviter une requête par ligne.
        Map<RoleEnum, Role> roleCache = new EnumMap<>(RoleEnum.class);

        UserImportResultDTO result = UserImportResultDTO.builder().build();

        try (InputStream in = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(in)) {

            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null) {
                throw new BusinessException("Le fichier ne contient aucune feuille.");
            }

            int firstRow = sheet.getFirstRowNum();
            int lastRow = sheet.getLastRowNum();

            for (int r = firstRow + 1; r <= lastRow; r++) { // +1 : on saute l'en-tête
                Row row = sheet.getRow(r);
                if (isRowEmpty(row)) {
                    continue;
                }
                result.setTotalRows(result.getTotalRows() + 1);
                int displayRow = r + 1; // numéro tel qu'affiché dans Excel (1-based)

                try {
                    createFromRow(row, roleCache);
                    result.setCreated(result.getCreated() + 1);
                } catch (Exception ex) {
                    result.setFailed(result.getFailed() + 1);
                    result.getErrors().add(UserImportResultDTO.RowError.builder()
                            .row(displayRow)
                            .message(ex.getMessage())
                            .build());
                }
            }
        } catch (IOException ex) {
            throw new BusinessException("Impossible de lire le fichier Excel : " + ex.getMessage());
        }

        return result;
    }

    /** Génère un modèle Excel (.xlsx) : en-tête + une ligne d'exemple. */
    public byte[] buildTemplate() {
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
             java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Utilisateurs");
            String[] headers = {"Prénom", "Nom", "Email", "Rôle", "Mot de passe"};

            // Style d'en-tête (gras)
            org.apache.poi.ss.usermodel.Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            org.apache.poi.ss.usermodel.CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(boldFont);

            Row header = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell c = header.createCell(i);
                c.setCellValue(headers[i]);
                c.setCellStyle(headerStyle);
            }

            // Ligne d'exemple
            Row example = sheet.createRow(1);
            String[] sample = {"Marie", "Dupont", "marie.dupont@exemple.com", "ETUDIANT", "motdepasse123"};
            for (int i = 0; i < sample.length; i++) {
                example.createCell(i).setCellValue(sample[i]);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.setColumnWidth(i, 22 * 256); // ~22 caractères de large
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new BusinessException("Impossible de générer le modèle Excel : " + ex.getMessage());
        }
    }
    private void createFromRow(Row row, Map<RoleEnum, Role> roleCache) {
        String prenom = cell(row, 0);
        String nom = cell(row, 1);
        String email = cell(row, 2);
        String roleRaw = cell(row, 3);
        String motDePasse = cell(row, 4);

        if (prenom.isBlank()) throw new BusinessException("Prénom manquant.");
        if (nom.isBlank()) throw new BusinessException("Nom manquant.");
        if (email.isBlank()) throw new BusinessException("Email manquant.");
        if (!email.matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
            throw new BusinessException("Email invalide : " + email);
        }
        if (motDePasse.length() < 6) {
            throw new BusinessException("Mot de passe manquant ou trop court (min. 6 caractères).");
        }

        RoleEnum roleEnum = parseRole(roleRaw);
        if (utilisateurRepository.existsByEmail(email)) {
            throw new BusinessException("Email déjà utilisé : " + email);
        }

        Role role = roleCache.computeIfAbsent(roleEnum, re -> roleRepository.findByNom(re)
                .orElseThrow(() -> new BusinessException("Rôle introuvable en base : " + re)));

        Utilisateur user = switch (roleEnum) {
            case ADMIN -> new Administrateur();
            case ENSEIGNANT -> new Enseignant();
            default -> new Etudiant();
        };

        user.setPrenom(prenom);
        user.setNom(nom);
        user.setEmail(email);
        user.setMotDePasse(passwordEncoder.encode(motDePasse));
        user.setRole(role);
        user.setActif(true);
        user.setDateCreation(LocalDateTime.now());

        utilisateurRepository.save(user);
    }

    private RoleEnum parseRole(String raw) {
        if (raw == null || raw.isBlank()) {
            return RoleEnum.ETUDIANT; // défaut
        }
        String v = raw.trim().toUpperCase();
        return switch (v) {
            case "ADMIN", "ADMINISTRATEUR" -> RoleEnum.ADMIN;
            case "ENSEIGNANT", "TEACHER", "PROF", "PROFESSEUR" -> RoleEnum.ENSEIGNANT;
            case "ETUDIANT", "STUDENT", "ELEVE" -> RoleEnum.ETUDIANT;
            default -> throw new BusinessException("Rôle non reconnu : " + raw);
        };
    }

    private String cell(Row row, int index) {
        Cell c = row.getCell(index, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (c == null) return "";
        return dataFormatter.formatCellValue(c).trim();
    }

    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        for (int i = 0; i <= 4; i++) {
            if (!cell(row, i).isBlank()) return false;
        }
        return true;
    }
}
