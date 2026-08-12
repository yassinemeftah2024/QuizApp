package com.quizapp.service;

import com.quizapp.dto.CreateQCMRequest;
import com.quizapp.dto.QCMDTO;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ForbiddenException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Classe;
import com.quizapp.model.Enseignant;
import com.quizapp.model.Matiere;
import com.quizapp.model.QCM;
import com.quizapp.model.Utilisateur;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.SourceGenerationEnum;
import com.quizapp.repository.ClasseRepository;
import com.quizapp.repository.MatiereRepository;
import com.quizapp.repository.QCMRepository;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QCMService {
    private final QCMRepository qcmRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MatiereRepository matiereRepository;
    private final ClasseRepository classeRepository;

    @Transactional(readOnly = true)
    public List<QCMDTO> getMyQuizzes() {
        return qcmRepository.findByEnseignantOrderByDateCreationDesc(currentTeacher())
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public QCMDTO getById(Long id) {
        return toDTO(ownedQuiz(id));
    }

    @Transactional
    public QCMDTO create(CreateQCMRequest request) {
        Enseignant teacher = currentTeacher();
        Matiere subject = resolveSubject(request, teacher);
        List<Classe> classes = resolveClasses(request.getClasseIds(), teacher);
        QCM quiz = QCM.builder()
                .titre(request.getTitre().trim())
                .description(request.getDescription())
                .matiere(subject != null ? subject.getNom() : request.getMatiere())
                .matiereRef(subject)
                .niveau(request.getNiveau())
                .difficulte(request.getDifficulte() == null ? DifficulteEnum.MOYEN : request.getDifficulte())
                .classes(classes)
                .mode(request.getMode())
                .source(SourceGenerationEnum.MANUEL)
                .dureeMinutes(request.getDureeMinutes())
                .shuffleQuestions(Boolean.TRUE.equals(request.getShuffleQuestions()))
                .showExplanations(Boolean.TRUE.equals(request.getShowExplanations()))
                .allowRetakes(Boolean.TRUE.equals(request.getAllowRetakes()))
                .disponibleEntrainement(Boolean.TRUE.equals(request.getDisponibleEntrainement())
                        || request.getMode() == com.quizapp.model.enums.ModeQuizEnum.ENTRAINEMENT)
                .publie(false).archive(false).enseignant(teacher)
                .dateCreation(LocalDateTime.now()).build();
        return toDTO(qcmRepository.save(quiz));
    }

    @Transactional
    public QCMDTO update(Long id, CreateQCMRequest request) {
        QCM quiz = ownedQuiz(id);
        Enseignant teacher = quiz.getEnseignant();
        Matiere subject = resolveSubject(request, teacher);
        if (request.getTitre() != null) quiz.setTitre(request.getTitre().trim());
        quiz.setDescription(request.getDescription());
        if (subject != null) {
            quiz.setMatiereRef(subject);
            quiz.setMatiere(subject.getNom());
        } else if (request.getMatiere() != null) {
            quiz.setMatiere(request.getMatiere());
        }
        quiz.setNiveau(request.getNiveau());
        if (request.getDifficulte() != null) quiz.setDifficulte(request.getDifficulte());
        if (request.getClasseIds() != null) quiz.setClasses(resolveClasses(request.getClasseIds(), teacher));
        if (request.getMode() != null) quiz.setMode(request.getMode());
        quiz.setDureeMinutes(request.getDureeMinutes());
        quiz.setShuffleQuestions(Boolean.TRUE.equals(request.getShuffleQuestions()));
        quiz.setShowExplanations(Boolean.TRUE.equals(request.getShowExplanations()));
        quiz.setAllowRetakes(Boolean.TRUE.equals(request.getAllowRetakes()));
        quiz.setDisponibleEntrainement(Boolean.TRUE.equals(request.getDisponibleEntrainement())
                || quiz.getMode() == com.quizapp.model.enums.ModeQuizEnum.ENTRAINEMENT);
        return toDTO(qcmRepository.save(quiz));
    }

    @Transactional
    public QCMDTO publish(Long id) {
        QCM quiz = ownedQuiz(id);
        if (quiz.getQuestions().isEmpty()) throw new BusinessException("Add at least one question before publishing");
        quiz.setPublie(true);
        return toDTO(qcmRepository.save(quiz));
    }

    @Transactional
    public QCMDTO unpublish(Long id) {
        QCM quiz = ownedQuiz(id);
        quiz.setPublie(false);
        return toDTO(qcmRepository.save(quiz));
    }

    @Transactional
    public void delete(Long id) {
        qcmRepository.delete(ownedQuiz(id));
    }

    private QCM ownedQuiz(Long id) {
        QCM quiz = qcmRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        if (!quiz.getEnseignant().getId().equals(currentTeacher().getId())) {
            throw new ForbiddenException("You can only manage your own quizzes");
        }
        return quiz;
    }

    private Enseignant currentTeacher() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!(user instanceof Enseignant teacher)) throw new ForbiddenException("Teacher account required");
        return teacher;
    }

    private Matiere resolveSubject(CreateQCMRequest request, Enseignant teacher) {
        if (request.getMatiereId() == null) return null;
        Matiere subject = matiereRepository.findById(request.getMatiereId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));
        if (!teacher.getMatieres().contains(subject)) throw new ForbiddenException("This subject is not assigned to you");
        return subject;
    }

    private List<Classe> resolveClasses(List<Long> ids, Enseignant teacher) {
        if (ids == null || ids.isEmpty()) return new ArrayList<>();
        List<Classe> classes = classeRepository.findAllById(ids);
        if (classes.size() != ids.stream().distinct().count()) throw new ResourceNotFoundException("One or more classes were not found");
        if (!teacher.getClasses().containsAll(classes)) throw new ForbiddenException("You can only target your assigned classes");
        return new ArrayList<>(classes);
    }

    public QCMDTO toDTO(QCM q) {
        return QCMDTO.builder()
                .id(q.getId()).titre(q.getTitre()).description(q.getDescription())
                .matiere(q.getMatiere()).matiereId(q.getMatiereRef() == null ? null : q.getMatiereRef().getId())
                .niveau(q.getNiveau()).difficulte(q.getDifficulte())
                .classeIds(q.getClasses().stream().map(Classe::getId).toList())
                .classeNoms(q.getClasses().stream().map(Classe::getNom).toList())
                .mode(q.getMode()).source(q.getSource()).dureeMinutes(q.getDureeMinutes())
                .publie(q.getPublie()).archive(q.getArchive())
                .shuffleQuestions(q.getShuffleQuestions()).showExplanations(q.getShowExplanations())
                .allowRetakes(q.getAllowRetakes()).disponibleEntrainement(q.getDisponibleEntrainement())
                .enseignantId(q.getEnseignant().getId()).nombreQuestions(q.getQuestions().size())
                .dateCreation(q.getDateCreation()).dateModification(q.getDateModification()).build();
    }
}
