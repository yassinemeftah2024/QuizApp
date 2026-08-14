package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ConflictException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.*;
import com.quizapp.model.enums.RoleEnum;
import com.quizapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final QCMRepository qcmRepository;
    private final MatiereRepository matiereRepository;
    private final ClasseRepository classeRepository;

    // ── Stats Dashboard ────────────────────────────────────────────────

    public AdminStatsDTO getStats() {
        List<Utilisateur> all = utilisateurRepository.findAll();
        long teachers = all.stream().filter(u -> u.getRole().getNom() == RoleEnum.ENSEIGNANT).count();
        long students = all.stream().filter(u -> u.getRole().getNom() == RoleEnum.ETUDIANT).count();
        long admins = all.stream().filter(u -> u.getRole().getNom() == RoleEnum.ADMIN).count();
        long quizzes = qcmRepository.countAllQuizzes();

        return AdminStatsDTO.builder()
                .totalTeachers(teachers)
                .totalStudents(students)
                .totalAdmins(admins)
                .totalUsers(all.size())
                .activeSessToday(0L) // Will be implemented by dev-b (SessionQuiz)
                .totalQuizzes(quizzes)
                .build();
    }

    // ── User CRUD ─────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public List<UtilisateurDTO> getAllUsers() {
        return utilisateurRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UtilisateurDTO createUser(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Cet email est déjà utilisé");
        }

        Role role = roleRepository.findByNom(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Rôle introuvable: " + request.getRole()));

        Utilisateur utilisateur = switch (request.getRole()) {
            case ADMIN -> {
                Administrateur a = new Administrateur();
                a.setDepartement(request.getDepartement());
                yield a;
            }
            case ENSEIGNANT -> {
                Enseignant e = new Enseignant();
                e.setEtablissement(request.getEtablissement());
                List<Matiere> matieres = matiereRepository.findAllById(request.getMatiereIds());
                if (matieres.size() != request.getMatiereIds().size()) {
                    throw new ResourceNotFoundException("Une ou plusieurs matières sont introuvables");
                }
                e.setMatieres(matieres);
                yield e;
            }
            case ETUDIANT -> new Etudiant();
            default -> throw new BusinessException("Rôle non supporté");
        };

        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur.setRole(role);
        utilisateur.setActif(true);
        utilisateur.setDateCreation(LocalDateTime.now());

        Utilisateur saved = utilisateurRepository.save(utilisateur);

        if (saved instanceof Enseignant enseignant) {
            List<Classe> classes = classeRepository.findAllById(request.getClasseIds());
            if (classes.size() != request.getClasseIds().size()) {
                throw new ResourceNotFoundException("Une ou plusieurs classes sont introuvables");
            }
            classes.forEach(classe -> {
                if (!classe.getEnseignants().contains(enseignant)) {
                    classe.getEnseignants().add(enseignant);
                }
            });
            classeRepository.saveAll(classes);
            enseignant.setClasses(classes);
        }

        return toDTO(saved);
    }

    @Transactional
    public UtilisateurDTO toggleStatus(Long id) {
        Utilisateur u = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        u.setActif(!u.isActif());
        return toDTO(utilisateurRepository.save(u));
    }

    @Transactional
    public UtilisateurDTO updateTeacherAssignments(Long id, TeacherAssignmentsRequest request) {
        Utilisateur user = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        if (!(user instanceof Enseignant teacher)) {
            throw new BusinessException("The selected user is not a teacher");
        }

        List<Matiere> matieres = matiereRepository.findAllById(request.getMatiereIds());
        if (matieres.size() != request.getMatiereIds().size()) {
            throw new ResourceNotFoundException("One or more subjects could not be found");
        }
        List<Classe> classes = classeRepository.findAllById(request.getClasseIds());
        if (classes.size() != request.getClasseIds().size()) {
            throw new ResourceNotFoundException("One or more classes could not be found");
        }

        classeRepository.findAll().forEach(classe -> classe.getEnseignants().removeIf(e -> e.getId().equals(teacher.getId())));
        classes.forEach(classe -> classe.getEnseignants().add(teacher));
        teacher.setMatieres(matieres);
        teacher.setClasses(classes);
        utilisateurRepository.save(teacher);
        classeRepository.flush();
        return toDTO(teacher);
    }

    @Transactional
    public void deleteUser(Long id) {
        // Prevent self-deletion
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur target = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        if (target.getEmail().equals(currentEmail)) {
            throw new BusinessException("Vous ne pouvez pas supprimer votre propre compte");
        }
        utilisateurRepository.deleteById(id);
    }

    // ── Mapper ───────────────────────────────────────────────────────

    private UtilisateurDTO toDTO(Utilisateur u) {
        UtilisateurDTO.UtilisateurDTOBuilder builder = UtilisateurDTO.builder()
                .id(u.getId())
                .nom(u.getNom())
                .prenom(u.getPrenom())
                .email(u.getEmail())
                .role(u.getRole().getNom())
                .avatarAnimal(u.getAvatarAnimal())
                .actif(u.isActif())
                .dateCreation(u.getDateCreation());

        if (u instanceof Enseignant e) {
            builder
                .matiereIds(e.getMatieres().stream().map(Matiere::getId).toList())
                .matiereNoms(e.getMatieres().stream().map(Matiere::getNom).toList())
                .classeIds(e.getClasses().stream().map(Classe::getId).toList())
                .classeNoms(e.getClasses().stream().map(Classe::getNom).toList());
        } else if (u instanceof Etudiant e && e.getClasse() != null) {
            builder.classeId(e.getClasse().getId()).classeNom(e.getClasse().getNom());
        }

        return builder.build();
    }
}
