package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ForbiddenException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.*;
import com.quizapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service @RequiredArgsConstructor
public class TrainingService {
    private final QCMRepository qcmRepository;
    private final TrainingAttemptRepository attemptRepository;
    private final SubjectEnrollmentRequestRepository enrollmentRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final QCMService qcmService;

    @Transactional(readOnly = true)
    public List<QCMDTO> available() {
        Etudiant student = currentStudent();
        return qcmRepository.findByDisponibleEntrainementTrueAndPublieTrueAndArchiveFalseOrderByDateCreationDesc().stream()
                .filter(q -> canAccess(student, q)).map(qcmService::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public TrainingQuizDTO quiz(Long quizId) {
        Etudiant student = currentStudent(); QCM quiz = accessibleQuiz(student, quizId);
        if (!Boolean.TRUE.equals(quiz.getAllowRetakes()) && attemptRepository.existsByStudentIdAndQcmId(student.getId(), quizId)) throw new BusinessException("You already completed this quiz");
        return TrainingQuizDTO.builder().id(quiz.getId()).titre(quiz.getTitre()).description(quiz.getDescription()).matiere(quiz.getMatiere())
                .niveau(quiz.getNiveau()).difficulte(quiz.getDifficulte()).dureeMinutes(quiz.getDureeMinutes()).allowRetakes(quiz.getAllowRetakes())
                .questions(quiz.getQuestions().stream().sorted(Comparator.comparing(Question::getOrdre)).map(this::studentQuestion).toList()).build();
    }

    @Transactional
    public TrainingResultDTO submit(Long quizId, TrainingSubmissionRequest request) {
        Etudiant student = currentStudent(); QCM quiz = accessibleQuiz(student, quizId);
        if (!Boolean.TRUE.equals(quiz.getAllowRetakes()) && attemptRepository.existsByStudentIdAndQcmId(student.getId(), quizId)) throw new BusinessException("This quiz only allows one attempt");
        Map<Long, TrainingAnswerRequest> submitted = new HashMap<>();
        if (request.getReponses() != null) request.getReponses().forEach(a -> submitted.put(a.getQuestionId(), a));
        int score = 0, maximum = 0, correctCount = 0;
        List<TrainingQuestionResultDTO> results = new ArrayList<>();
        for (Question question : quiz.getQuestions()) {
            maximum += question.getPoints();
            Set<Long> correctIds = question.getReponses().stream().filter(a -> Boolean.TRUE.equals(a.getCorrecte())).map(Reponse::getId).collect(java.util.stream.Collectors.toSet());
            TrainingAnswerRequest answer = submitted.get(question.getId());
            Set<Long> selected = answer == null || answer.getReponseIds() == null ? Set.of() : new HashSet<>(answer.getReponseIds());
            Set<Long> allowed = question.getReponses().stream().map(Reponse::getId).collect(java.util.stream.Collectors.toSet());
            if (!allowed.containsAll(selected)) throw new BusinessException("An answer does not belong to its question");
            boolean isCorrect = !correctIds.isEmpty() && selected.equals(correctIds);
            int awarded = isCorrect ? question.getPoints() : 0;
            if (isCorrect) { score += awarded; correctCount++; }
            results.add(TrainingQuestionResultDTO.builder().questionId(question.getId()).correcte(isCorrect).pointsObtenus(awarded)
                    .bonnesReponseIds(new ArrayList<>(correctIds)).explication(Boolean.TRUE.equals(quiz.getShowExplanations()) ? question.getExplication() : null).build());
        }
        double percentage = maximum == 0 ? 0 : Math.round((score * 10000.0 / maximum)) / 100.0;
        TrainingAttempt attempt = attemptRepository.save(TrainingAttempt.builder().student(student).qcm(quiz).score(score).scoreMaximum(maximum)
                .bonnesReponses(correctCount).totalQuestions(quiz.getQuestions().size()).pourcentage(percentage).build());
        student.setTotalQuizComplete(student.getTotalQuizComplete() + 1); student.setTotalPoints(student.getTotalPoints() + score);
        return TrainingResultDTO.builder().attemptId(attempt.getId()).quizId(quiz.getId()).quizTitre(quiz.getTitre()).score(score).scoreMaximum(maximum)
                .bonnesReponses(correctCount).totalQuestions(quiz.getQuestions().size()).pourcentage(percentage).dateTentative(attempt.getDateTentative()).questions(results).build();
    }

    @Transactional(readOnly = true)
    public List<TrainingHistoryDTO> history() {
        return attemptRepository.findByStudentIdOrderByDateTentativeDesc(currentStudent().getId()).stream().map(a -> TrainingHistoryDTO.builder()
                .attemptId(a.getId()).quizId(a.getQcm().getId()).quizTitre(a.getQcm().getTitre()).matiere(a.getQcm().getMatiere())
                .score(a.getScore()).scoreMaximum(a.getScoreMaximum()).pourcentage(a.getPourcentage()).bonnesReponses(a.getBonnesReponses())
                .totalQuestions(a.getTotalQuestions()).dateTentative(a.getDateTentative()).build()).toList();
    }

    private TrainingQuestionDTO studentQuestion(Question q) {
        return TrainingQuestionDTO.builder().id(q.getId()).texte(q.getTexte()).type(q.getType()).ordre(q.getOrdre()).dureeSecondes(q.getDureeSecondes())
                .points(q.getPoints()).mediaUrl(q.getMediaUrl()).mediaType(q.getMediaType()).mediaAlt(q.getMediaAlt())
                .reponses(q.getReponses().stream().map(a -> ReponseDTO.builder().id(a.getId()).texte(a.getTexte()).correcte(null).option(a.getOption()).build()).toList()).build();
    }
    private QCM accessibleQuiz(Etudiant student, Long id) {
        QCM q = qcmRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Training quiz not found"));
        if (!Boolean.TRUE.equals(q.getPublie()) || !Boolean.TRUE.equals(q.getDisponibleEntrainement()) || Boolean.TRUE.equals(q.getArchive()) || !canAccess(student, q)) throw new ForbiddenException("This training quiz is not available to you");
        return q;
    }
    private boolean canAccess(Etudiant student, QCM quiz) {
        boolean classAccess = quiz.getClasses().isEmpty() || (student.getClasse() != null && quiz.getClasses().contains(student.getClasse()));
        if (!classAccess) return false;
        if (quiz.getMatiereRef() == null) return true;
        return enrollmentRepository.findByStudentIdAndMatiereId(student.getId(), quiz.getMatiereRef().getId()).map(r -> "APPROVED".equals(r.getStatus())).orElse(false);
    }
    private Etudiant currentStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!(user instanceof Etudiant student)) throw new ForbiddenException("Student account required"); return student;
    }
}
