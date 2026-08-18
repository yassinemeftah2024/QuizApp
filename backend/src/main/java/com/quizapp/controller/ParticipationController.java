package com.quizapp.controller;

import com.quizapp.dto.JoinSessionRequest;
import com.quizapp.model.Participation;
import com.quizapp.service.ParticipationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST pour les participations (rejoindre une session).
 *
 * Endpoints :
 * POST /api/participations/join
 * GET  /api/participations/session/{sessionId}
 * GET  /api/participations/session/{sessionId}/leaderboard
 */
import org.springframework.messaging.simp.SimpMessagingTemplate;
@RestController
@RequestMapping("/participations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ParticipationController {

    private final ParticipationService participationService;
    private final SimpMessagingTemplate messagingTemplate;

    // =====================================================
    // 1. REJOINDRE UNE SESSION
    // =====================================================
    @PostMapping("/join")
    public ResponseEntity<?> joinSession(@Valid @RequestBody JoinSessionRequest request) {
        try {
            Participation participation = participationService.joinSession(
                    request.getSessionId(),
                    request.getPseudonyme(),
                    request.getUtilisateurId()
            );

            // 🔔 Notifie le teacher en temps réel
            var participants = participationService.getParticipants(request.getSessionId());
            messagingTemplate.convertAndSend(
                    "/topic/session/" + request.getSessionId() + "/participants",
                    participants
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(participation);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =====================================================
    // 2. LISTE DES PARTICIPANTS D'UNE SESSION
    // =====================================================
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<Participation>> getParticipants(@PathVariable Long sessionId) {
        List<Participation> participants = participationService.getParticipants(sessionId);
        return ResponseEntity.ok(participants);
    }

    // =====================================================
    // 3. CLASSEMENT D'UNE SESSION
    // =====================================================
    @GetMapping("/session/{sessionId}/leaderboard")
    public ResponseEntity<List<Participation>> getLeaderboard(@PathVariable Long sessionId) {
        List<Participation> leaderboard = participationService.getLeaderboard(sessionId);
        return ResponseEntity.ok(leaderboard);
    }
}