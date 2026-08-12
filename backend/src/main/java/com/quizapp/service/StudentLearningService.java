package com.quizapp.service;

import com.quizapp.dto.QCMDTO;
import com.quizapp.dto.SubjectEnrollmentDTO;
import com.quizapp.exception.ForbiddenException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.*;
import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class StudentLearningService {
    private final UtilisateurRepository utilisateurRepository;
    private final MatiereRepository matiereRepository;
    private final SubjectEnrollmentRequestRepository requestRepository;
    private final QCMRepository qcmRepository;

    @Transactional(readOnly = true)
    public List<QCMDTO> trainingQuizzes() {
        return qcmRepository.findByModeAndPublieTrueAndArchiveFalseOrderByDateCreationDesc(ModeQuizEnum.ENTRAINEMENT)
                .stream().map(this::quizDTO).toList();
    }

    @Transactional
    public SubjectEnrollmentDTO requestSubject(Long subjectId) {
        Etudiant student = currentStudent();
        Matiere subject = matiereRepository.findById(subjectId).orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        SubjectEnrollmentRequest request = requestRepository.findByStudentIdAndMatiereId(student.getId(), subjectId)
                .orElse(SubjectEnrollmentRequest.builder().student(student).matiere(subject).status("PENDING").build());
        if (!"APPROVED".equals(request.getStatus())) request.setStatus("PENDING");
        return dto(requestRepository.save(request));
    }

    @Transactional(readOnly = true)
    public List<SubjectEnrollmentDTO> myRequests() {
        return requestRepository.findByStudentId(currentStudent().getId()).stream().map(this::dto).toList();
    }

    @Transactional(readOnly = true)
    public List<SubjectEnrollmentDTO> teacherPendingRequests() {
        Enseignant teacher = currentTeacher();
        return requestRepository.findByStatus("PENDING").stream()
                .filter(request -> teacher.getMatieres().contains(request.getMatiere()))
                .filter(request -> request.getStudent().getClasse() != null && teacher.getClasses().contains(request.getStudent().getClasse()))
                .map(this::dto).toList();
    }

    @Transactional
    public SubjectEnrollmentDTO decide(Long requestId, boolean approve) {
        Enseignant teacher = currentTeacher();
        SubjectEnrollmentRequest request = requestRepository.findById(requestId).orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!teacher.getMatieres().contains(request.getMatiere()) || request.getStudent().getClasse() == null || !teacher.getClasses().contains(request.getStudent().getClasse())) {
            throw new ForbiddenException("You cannot manage this subject request");
        }
        request.setTeacher(teacher); request.setStatus(approve ? "APPROVED" : "REJECTED");
        return dto(requestRepository.save(request));
    }

    private Etudiant currentStudent() { return (Etudiant) currentUser(Etudiant.class); }
    private Enseignant currentTeacher() { return (Enseignant) currentUser(Enseignant.class); }
    private Utilisateur currentUser(Class<?> expected) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!expected.isInstance(user)) throw new ForbiddenException("Invalid account role");
        return user;
    }
    private SubjectEnrollmentDTO dto(SubjectEnrollmentRequest r) { return SubjectEnrollmentDTO.builder().id(r.getId()).studentId(r.getStudent().getId()).studentName(r.getStudent().getPrenom()+" "+r.getStudent().getNom()).matiereId(r.getMatiere().getId()).matiereNom(r.getMatiere().getNom()).status(r.getStatus()).build(); }
    private QCMDTO quizDTO(QCM q) { return QCMDTO.builder().id(q.getId()).titre(q.getTitre()).description(q.getDescription()).matiere(q.getMatiere()).niveau(q.getNiveau()).mode(q.getMode()).source(q.getSource()).dureeMinutes(q.getDureeMinutes()).publie(q.getPublie()).archive(q.getArchive()).enseignantId(q.getEnseignant().getId()).nombreQuestions(q.getQuestions().size()).dateCreation(q.getDateCreation()).build(); }
}
