package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.exception.BusinessException;
import com.quizapp.exception.ForbiddenException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.*;
import com.quizapp.model.enums.TypeQuestionEnum;
import com.quizapp.repository.QCMRepository;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service @RequiredArgsConstructor
public class QuestionService {
    private final QCMRepository qcmRepository;
    private final QuestionRepository questionRepository;
    private final UtilisateurRepository utilisateurRepository;

    @Transactional(readOnly = true)
    public List<QuestionDTO> list(Long quizId) {
        ownedQuiz(quizId);
        return questionRepository.findByQcmIdOrderByOrdreAsc(quizId).stream().map(this::toDTO).toList();
    }

    @Transactional public QuestionDTO create(Long quizId, CreateQuestionRequest request) {
        QCM quiz = ownedQuiz(quizId); validate(request);
        Question question = new Question();
        apply(question, request, quiz, request.getOrdre() == null ? quiz.getQuestions().size() + 1 : request.getOrdre());
        return toDTO(questionRepository.save(question));
    }

    @Transactional public QuestionDTO update(Long quizId, Long questionId, CreateQuestionRequest request) {
        QCM quiz = ownedQuiz(quizId); Question question = ownedQuestion(quiz, questionId); validate(request);
        apply(question, request, quiz, request.getOrdre() == null ? question.getOrdre() : request.getOrdre());
        return toDTO(questionRepository.save(question));
    }

    @Transactional public List<QuestionDTO> replaceAll(Long quizId, List<CreateQuestionRequest> requests) {
        QCM quiz = ownedQuiz(quizId);
        List<CreateQuestionRequest> safeRequests = requests == null ? List.of() : requests;
        safeRequests.forEach(this::validate);
        questionRepository.deleteAll(questionRepository.findByQcmIdOrderByOrdreAsc(quizId));
        questionRepository.flush();
        List<Question> saved = new ArrayList<>();
        for (int index = 0; index < safeRequests.size(); index++) {
            Question question = new Question(); apply(question, safeRequests.get(index), quiz, index + 1);
            saved.add(questionRepository.save(question));
        }
        return saved.stream().map(this::toDTO).toList();
    }

    @Transactional public void delete(Long quizId, Long questionId) {
        QCM quiz = ownedQuiz(quizId); questionRepository.delete(ownedQuestion(quiz, questionId));
    }

    private void apply(Question question, CreateQuestionRequest request, QCM quiz, int order) {
        question.setTexte(request.getTexte().trim()); question.setType(request.getType()); question.setOrdre(order);
        question.setDureeSecondes(request.getDureeSecondes() == null ? 30 : request.getDureeSecondes());
        question.setPoints(request.getPoints() == null ? 100 : request.getPoints());
        question.setExplication(request.getExplication()); question.setMediaUrl(blankToNull(request.getMediaUrl()));
        question.setMediaType(blankToNull(request.getMediaType())); question.setMediaAlt(blankToNull(request.getMediaAlt())); question.setQcm(quiz);
        if (question.getReponses() == null) question.setReponses(new ArrayList<>()); question.getReponses().clear();
        List<CreateReponseRequest> answers = request.getReponses() == null ? List.of() : request.getReponses();
        for (int index = 0; index < answers.size(); index++) {
            CreateReponseRequest item = answers.get(index);
            question.getReponses().add(Reponse.builder().texte(item.getTexte().trim()).correcte(Boolean.TRUE.equals(item.getCorrecte()))
                    .option(item.getOption() == null ? String.valueOf((char) ('A' + index)) : item.getOption()).question(question).build());
        }
    }

    private void validate(CreateQuestionRequest request) {
        if (request.getDureeSecondes() != null && request.getDureeSecondes() < 5) throw new BusinessException("Question duration must be at least 5 seconds");
        if (request.getPoints() != null && request.getPoints() < 0) throw new BusinessException("Question points cannot be negative");
        List<CreateReponseRequest> answers = request.getReponses() == null ? List.of() : request.getReponses();
        if (request.getType() == TypeQuestionEnum.TEXTE_LIBRE) return;
        if (answers.size() < 2) throw new BusinessException("A choice question requires at least two answers");
        long correct = answers.stream().filter(a -> Boolean.TRUE.equals(a.getCorrecte())).count();
        if (correct == 0) throw new BusinessException("Select at least one correct answer");
        if ((request.getType() == TypeQuestionEnum.CHOIX_UNIQUE || request.getType() == TypeQuestionEnum.VRAI_FAUX) && correct != 1) throw new BusinessException("This question type requires exactly one correct answer");
        if (request.getType() == TypeQuestionEnum.VRAI_FAUX && answers.size() != 2) throw new BusinessException("A true/false question requires exactly two answers");
    }

    private QCM ownedQuiz(Long id) {
        QCM quiz = qcmRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        if (!quiz.getEnseignant().getId().equals(currentTeacher().getId())) throw new ForbiddenException("You can only manage your own quizzes");
        return quiz;
    }
    private Question ownedQuestion(QCM quiz, Long id) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (!question.getQcm().getId().equals(quiz.getId())) throw new ResourceNotFoundException("Question not found in this quiz");
        return question;
    }
    private Enseignant currentTeacher() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Utilisateur user = utilisateurRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!(user instanceof Enseignant teacher)) throw new ForbiddenException("Teacher account required"); return teacher;
    }
    public QuestionDTO toDTO(Question q) {
        return QuestionDTO.builder().id(q.getId()).texte(q.getTexte()).type(q.getType()).ordre(q.getOrdre()).dureeSecondes(q.getDureeSecondes())
                .points(q.getPoints()).explication(q.getExplication()).mediaUrl(q.getMediaUrl()).mediaType(q.getMediaType()).mediaAlt(q.getMediaAlt())
                .reponses(q.getReponses().stream().map(a -> ReponseDTO.builder().id(a.getId()).texte(a.getTexte()).correcte(a.getCorrecte()).option(a.getOption()).build()).toList()).build();
    }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
}
