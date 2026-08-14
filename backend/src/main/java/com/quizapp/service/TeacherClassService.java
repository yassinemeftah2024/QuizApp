package com.quizapp.service;

import com.quizapp.dto.ClasseDTO;
import com.quizapp.dto.UtilisateurDTO;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ForbiddenException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Classe;
import com.quizapp.model.Enseignant;
import com.quizapp.model.Etudiant;
import com.quizapp.model.Utilisateur;
import com.quizapp.model.Matiere;
import com.quizapp.repository.ClasseRepository;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherClassService {

    private final UtilisateurRepository utilisateurRepository;
    private final ClasseRepository classeRepository;

    @Transactional(readOnly = true)
    public List<ClasseDTO> getMyClasses() {
        return currentTeacher().getClasses().stream().map(this::toClasseDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<Matiere> getMySubjects() {
        return List.copyOf(currentTeacher().getMatieres());
    }

    @Transactional(readOnly = true)
    public List<UtilisateurDTO> getStudents(Long classeId) {
        Classe classe = ownedClass(classeId);
        return classe.getEtudiants().stream().map(this::toStudentDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<UtilisateurDTO> getAvailableStudents() {
        return utilisateurRepository.findAll().stream()
                .filter(Etudiant.class::isInstance)
                .map(Etudiant.class::cast)
                .filter(student -> student.getClasse() == null)
                .map(this::toStudentDTO)
                .toList();
    }

    @Transactional
    public UtilisateurDTO assignStudent(Long classeId, Long studentId) {
        Classe classe = ownedClass(classeId);
        Utilisateur user = utilisateurRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!(user instanceof Etudiant student)) {
            throw new BusinessException("The selected user is not a student");
        }
        student.setClasse(classe);
        return toStudentDTO(utilisateurRepository.save(student));
    }

    @Transactional
    public UtilisateurDTO removeStudent(Long classeId, Long studentId) {
        Classe classe = ownedClass(classeId);
        Utilisateur user = utilisateurRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!(user instanceof Etudiant student) || student.getClasse() == null || !student.getClasse().getId().equals(classe.getId())) {
            throw new BusinessException("This student does not belong to the selected class");
        }
        student.setClasse(null);
        return toStudentDTO(utilisateurRepository.save(student));
    }

    private Enseignant currentTeacher() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        if (!(user instanceof Enseignant teacher)) {
            throw new ForbiddenException("Teacher account required");
        }
        return teacher;
    }

    private Classe ownedClass(Long classeId) {
        Enseignant teacher = currentTeacher();
        return teacher.getClasses().stream()
                .filter(classe -> classe.getId().equals(classeId))
                .findFirst()
                .orElseThrow(() -> new ForbiddenException("You are not assigned to this class"));
    }

    private ClasseDTO toClasseDTO(Classe classe) {
        return ClasseDTO.builder()
                .id(classe.getId()).nom(classe.getNom()).niveau(classe.getNiveau())
                .section(classe.getSection()).anneeAcademique(classe.getAnneeAcademique())
                .nombreEtudiants(classe.getEtudiants().size()).build();
    }

    private UtilisateurDTO toStudentDTO(Etudiant student) {
        return UtilisateurDTO.builder()
                .id(student.getId()).nom(student.getNom()).prenom(student.getPrenom())
                .email(student.getEmail()).role(student.getRole().getNom()).actif(student.isActif())
                .dateCreation(student.getDateCreation())
                .classeId(student.getClasse() == null ? null : student.getClasse().getId())
                .classeNom(student.getClasse() == null ? null : student.getClasse().getNom())
                .build();
    }
}
