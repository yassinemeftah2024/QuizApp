package com.quizapp.controller;

import com.quizapp.model.Participation;
import com.quizapp.service.ParticipationService;
import com.quizapp.service.SessionQuizService;
import com.quizapp.service.ReponseEtudiantService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.List;
import java.util.Map;

/**
 * Controller WebSocket (STOMP) pour le temps réel.
 */
@Controller
@RequiredArgsConstructor
public class QuizWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ParticipationService participationService;
    private final SessionQuizService sessionQuizService;
    private final ReponseEtudiantService reponseEtudiantService;

    /**
     * Notifie tout le monde qu'un joueur a rejoint.
     * Client → /app/session/{sessionId}/join-notify
     */
    @MessageMapping("/session/{sessionId}/join-notify")
    public void notifyJoin(@DestinationVariable Long sessionId) {
        List<Participation> participants = participationService.getParticipants(sessionId);

        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/participants",
                participants
        );
    }

    /**
     * L'enseignant démarre la session.
     * Client → /app/session/{sessionId}/start
     */
    @MessageMapping("/session/{sessionId}/start")
    public void startSession(@DestinationVariable Long sessionId) {
        try {
            var optSession = sessionQuizService.findById(sessionId);
            if (optSession.isPresent()) {
                var session = optSession.get();
                if (session.getStatut() == com.quizapp.model.enums.StatutSessionEnum.PLANIFIEE) {
                    session = sessionQuizService.startSession(sessionId);
                }
                messagingTemplate.convertAndSend(
                        "/topic/session/" + sessionId + "/status",
                        Map.of(
                                "statut", session.getStatut().name(),
                                "message", "La session a démarré !",
                                "questionIndex", session.getCurrentQuestionIndex()
                        )
                );
            }
        } catch (RuntimeException e) {
            messagingTemplate.convertAndSend(
                    "/topic/session/" + sessionId + "/error",
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Passer à la question suivante.
     * Client → /app/session/{sessionId}/next-question
     */
    @MessageMapping("/session/{sessionId}/next-question")
    public void nextQuestion(@DestinationVariable Long sessionId) {
        try {
            var optSession = sessionQuizService.findById(sessionId);
            if (optSession.isPresent() && optSession.get().getStatut() == com.quizapp.model.enums.StatutSessionEnum.EN_COURS) {
                var session = sessionQuizService.nextQuestion(sessionId);
                if (session.getStatut() == com.quizapp.model.enums.StatutSessionEnum.TERMINEE) {
                    messagingTemplate.convertAndSend(
                            "/topic/session/" + sessionId + "/status",
                            Map.of("statut", "TERMINEE")
                    );
                } else {
                    messagingTemplate.convertAndSend(
                            "/topic/session/" + sessionId + "/question",
                            Map.of(
                                    "questionIndex", session.getCurrentQuestionIndex(),
                                    "message", "Nouvelle question !"
                            )
                    );
                }
            }
        } catch (RuntimeException e) {
            messagingTemplate.convertAndSend(
                    "/topic/session/" + sessionId + "/error",
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Réception d'une réponse d'un joueur.
     * Client → /app/session/{sessionId}/answer
     */
    @MessageMapping("/session/{sessionId}/answer")
public void receiveAnswer(@DestinationVariable Long sessionId,
                          @Payload Map<String, Object> payload) {
    try {
        Long participationId = Long.valueOf(payload.get("participationId").toString());
        Long questionId = Long.valueOf(payload.get("questionId").toString());
        List<Long> choix = (List<Long>) payload.get("choixSelectionnes");
        Integer tempsReponse = payload.get("tempsReponse") != null
                ? Integer.valueOf(payload.get("tempsReponse").toString())
                : null;
        Double scoreObtenu = payload.get("scoreObtenu") != null
                ? Double.valueOf(payload.get("scoreObtenu").toString())
                : 0.0;
        boolean estCorrecte = payload.get("estCorrecte") != null
                && Boolean.parseBoolean(payload.get("estCorrecte").toString());

        reponseEtudiantService.submitAnswer(
                participationId,
                questionId,
                sessionId,
                choix,
                tempsReponse,
                scoreObtenu,
                estCorrecte
        );

        // Diffuse le nouveau classement à tout le monde
        var leaderboard = participationService.getLeaderboard(sessionId);
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/leaderboard",
                leaderboard
        );

        // Confirme la réception au joueur
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/answer-received",
                Map.of("message", "Réponse enregistrée", "participationId", participationId)
        );

    } catch (Exception e) {
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/error",
                Map.of("error", e.getMessage())
        );
    }
}

    /**
     * Demande le classement.
     * Client → /app/session/{sessionId}/leaderboard
     */
    @MessageMapping("/session/{sessionId}/leaderboard")
    public void sendLeaderboard(@DestinationVariable Long sessionId) {
        List<Participation> leaderboard = participationService.getLeaderboard(sessionId);

        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/leaderboard",
                leaderboard
        );
    }
}