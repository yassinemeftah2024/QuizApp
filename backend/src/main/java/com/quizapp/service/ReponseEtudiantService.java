package com.quizapp.service;

import com.quizapp.model.Participation;
import com.quizapp.model.ReponseEtudiant;
import com.quizapp.model.SessionQuiz;
import com.quizapp.model.enums.StatutSessionEnum;
import com.quizapp.repository.ParticipationRepository;
import com.quizapp.repository.ReponseEtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReponseEtudiantService {

    private final ReponseEtudiantRepository reponseEtudiantRepository;
    private final ParticipationRepository participationRepository;
    private final SessionQuizService sessionQuizService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Enregistre la réponse d'un joueur.
     */
    @Transactional
    public ReponseEtudiant submitAnswer(Long participationId,
                                        Long questionId,
                                        Long sessionId,
                                        List<Long> choixSelectionnes,
                                        Integer tempsReponse,
                                        Double scoreObtenu,
                                        boolean estCorrecte) {

        // Vérifier que le joueur n'a pas déjà répondu à cette question
        if (reponseEtudiantRepository.existsByParticipationIdAndQuestionId(participationId, questionId)) {
            throw new RuntimeException("Ce joueur a déjà répondu à cette question");
        }

        ReponseEtudiant reponse = ReponseEtudiant.builder()
                .participationId(participationId)
                .questionId(questionId)
                .sessionId(sessionId)
                .choixSelectionnes(choixSelectionnes)
                .tempsReponse(tempsReponse)
                .scoreObtenu(scoreObtenu)
                .estCorrecte(estCorrecte)
                .build();

        ReponseEtudiant saved = reponseEtudiantRepository.save(reponse);

        // Mettre à jour le score total de la participation
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation introuvable"));

        participation.setScoreTotal(participation.getScoreTotal() + scoreObtenu);
        if (tempsReponse != null) {
            participation.setTempsTotal(participation.getTempsTotal() + tempsReponse);
        }
        participationRepository.save(participation);

        // Diffuser le classement mis à jour
        List<Participation> leaderboard = participationRepository.findBySessionIdOrderByScoreTotalDesc(sessionId);
        messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/leaderboard", leaderboard);

        // Vérifier si tous les participants ont répondu à la question active
        long totalParticipants = participationRepository.countBySessionId(sessionId);
        long countSubmitted = reponseEtudiantRepository.countBySessionIdAndQuestionId(sessionId, questionId);

        if (totalParticipants > 0 && countSubmitted >= totalParticipants) {
            try {
                SessionQuiz session = sessionQuizService.nextQuestion(sessionId);
                if (session.getStatut() == StatutSessionEnum.TERMINEE) {
                    messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/status", Map.of("statut", "TERMINEE"));
                } else {
                    messagingTemplate.convertAndSend("/topic/session/" + sessionId + "/question", Map.of("questionIndex", session.getCurrentQuestionIndex()));
                }
            } catch (Exception ignored) {
                // Session déjà terminée ou fermée
            }
        }

        return saved;
    }

    public List<ReponseEtudiant> getByParticipation(Long participationId) {
        return reponseEtudiantRepository.findByParticipationId(participationId);
    }

    public List<ReponseEtudiant> getBySession(Long sessionId) {
        return reponseEtudiantRepository.findBySessionId(sessionId);
    }
}