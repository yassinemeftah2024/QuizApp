package com.quizapp.service;

import com.quizapp.model.SessionQuiz;
import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.model.enums.StatutSessionEnum;
import com.quizapp.repository.SessionQuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

/**
 * Service qui contient toute la logique métier des sessions de quiz.
 *
 * Le Controller appellera ce Service.
 * Le Service appellera le Repository.
 *
 * Règle d'or :
 * Controller → Service → Repository → Base de données
 */
@Service
@RequiredArgsConstructor
public class SessionQuizService {

    private final SessionQuizRepository sessionQuizRepository;
    private final Random random = new Random();

    // =====================================================
    // 1. CRÉER UNE SESSION
    // =====================================================

    @Transactional
    public SessionQuiz createSession(Long qcmId,
                                     Long createdBy,
                                     ModeQuizEnum mode,
                                     Integer nombreMaxParticipants) {

        String pin = generateUniquePin();
        String qrToken = UUID.randomUUID().toString();
        SessionQuiz session = SessionQuiz.builder()
                .codePIN(pin)
                .qrCodeToken(qrToken)
                .qcmId(qcmId)
                .createdBy(createdBy)
                .mode(mode)
                .statut(StatutSessionEnum.PLANIFIEE)
                .nombreMaxParticipants(nombreMaxParticipants)
                .currentQuestionIndex(0)
                .build();

        return sessionQuizRepository.save(session);
    }

    // =====================================================
    // 2. GÉNÉRER UN CODE PIN UNIQUE
    // =====================================================

    private String generateUniquePin() {
        String pin;
        do {
            int number = 100000 + random.nextInt(900000);
            pin = String.valueOf(number);
        } while (sessionQuizRepository.existsByCodePIN(pin));

        return pin;
    }

    // =====================================================
    // 3. TROUVER UNE SESSION
    // =====================================================

    public Optional<SessionQuiz> findById(Long id) {
        return sessionQuizRepository.findById(id);
    }

    public Optional<SessionQuiz> findByCodePIN(String codePIN) {
        return sessionQuizRepository.findByCodePIN(codePIN);
    }

    public Optional<SessionQuiz> findByQrCodeToken(String qrCodeToken) {
        return sessionQuizRepository.findByQrCodeToken(qrCodeToken);
    }

    public List<SessionQuiz> findByEnseignant(Long enseignantId) {
        return sessionQuizRepository.findByCreatedBy(enseignantId);
    }

    // =====================================================
    // 4. DÉMARRER UNE SESSION
    // =====================================================

    @Transactional
    public SessionQuiz startSession(Long sessionId) {
        SessionQuiz session = sessionQuizRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + sessionId));

        if (session.getStatut() != StatutSessionEnum.PLANIFIEE) {
            throw new RuntimeException("Impossible de démarrer une session qui n'est pas en statut PLANIFIEE");
        }

        session.setStatut(StatutSessionEnum.EN_COURS);
        session.setDateDebutReelle(LocalDateTime.now());
        session.setCurrentQuestionIndex(0);

        return sessionQuizRepository.save(session);
    }

    // =====================================================
    // 5. TERMINER UNE SESSION
    // =====================================================

    @Transactional
    public SessionQuiz finishSession(Long sessionId) {
        SessionQuiz session = sessionQuizRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + sessionId));

        session.setStatut(StatutSessionEnum.TERMINEE);
        session.setDateFin(LocalDateTime.now());

        return sessionQuizRepository.save(session);
    }

    // =====================================================
    // 6. ANNULER UNE SESSION
    // =====================================================

    @Transactional
    public SessionQuiz cancelSession(Long sessionId) {
        SessionQuiz session = sessionQuizRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + sessionId));

        session.setStatut(StatutSessionEnum.ANNULEE);
        session.setDateFin(LocalDateTime.now());

        return sessionQuizRepository.save(session);
    }

    // =====================================================
    // 7. PASSER À LA QUESTION SUIVANTE
    // =====================================================

    @Transactional
    public SessionQuiz nextQuestion(Long sessionId) {
        SessionQuiz session = sessionQuizRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable avec l'id : " + sessionId));

        if (session.getStatut() != StatutSessionEnum.EN_COURS) {
            throw new RuntimeException("La session n'est pas en cours");
        }

        session.setCurrentQuestionIndex(session.getCurrentQuestionIndex() + 1);
        return sessionQuizRepository.save(session);
    }
}