package com.quizapp.controller;

import com.quizapp.dto.CreateSessionRequest;
import com.quizapp.model.SessionQuiz;
import com.quizapp.service.SessionQuizService;
import jakarta.validation.Valid;
import com.quizapp.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.messaging.simp.SimpMessagingTemplate;
/**
 * Controller REST pour les sessions de quiz.
 *
 * Exemple d'URL :
 * POST   /api/sessions
 * GET    /api/sessions/{id}
 * GET    /api/sessions/pin/{codePIN}
 * POST   /api/sessions/{id}/start
 * POST   /api/sessions/{id}/finish
 * POST   /api/sessions/{id}/cancel
 * POST   /api/sessions/{id}/next-question
 */
import com.quizapp.dto.QuestionDTO;
import com.quizapp.service.QuestionService;

@RestController
@RequestMapping("/sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SessionQuizController {

    private final SessionQuizService sessionQuizService;
    private final QuestionService questionService;
    private final QrCodeService qrCodeService;
    private final SimpMessagingTemplate messagingTemplate;
    // =====================================================
    // 1. CRÉER UNE SESSION
    // =====================================================
    @PostMapping
    public ResponseEntity<SessionQuiz> createSession(@Valid @RequestBody CreateSessionRequest request) {
        SessionQuiz session = sessionQuizService.createSession(
                request.getQcmId(),
                request.getCreatedBy(),
                request.getMode(),
                request.getNombreMaxParticipants()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(session);
    }


    // =====================================================
    // 2. RÉCUPÉRER UNE SESSION PAR ID
    // =====================================================
    @GetMapping("/{id}")
    public ResponseEntity<SessionQuiz> getById(@PathVariable Long id) {
        return sessionQuizService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // 3. RÉCUPÉRER UNE SESSION PAR CODE PIN
    // =====================================================
    @GetMapping("/pin/{codePIN}")
    public ResponseEntity<SessionQuiz> getByPin(@PathVariable String codePIN) {
        return sessionQuizService.findByCodePIN(codePIN)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // =====================================================
    // 4. RÉCUPÉRER LES SESSIONS D'UN ENSEIGNANT
    // =====================================================
    @GetMapping("/enseignant/{enseignantId}")
    public ResponseEntity<List<SessionQuiz>> getByEnseignant(@PathVariable Long enseignantId) {
        List<SessionQuiz> sessions = sessionQuizService.findByEnseignant(enseignantId);
        return ResponseEntity.ok(sessions);
    }

    // =====================================================
    // 5. DÉMARRER UNE SESSION
    // =====================================================
    @PostMapping("/{id}/start")
    public ResponseEntity<?> startSession(@PathVariable Long id) {
    try {
        SessionQuiz session = sessionQuizService.startSession(id);
        messagingTemplate.convertAndSend(
                "/topic/session/" + id + "/status",
                Map.of("statut", session.getStatut().name(), "questionIndex", session.getCurrentQuestionIndex())
        );
        return ResponseEntity.ok(session);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}

    // =====================================================
    // 6. TERMINER UNE SESSION
    // =====================================================
    @PostMapping("/{id}/finish")
    public ResponseEntity<?> finishSession(@PathVariable Long id) {
    try {
        SessionQuiz session = sessionQuizService.finishSession(id);
        messagingTemplate.convertAndSend(
                "/topic/session/" + id + "/status",
                Map.of("statut", "TERMINEE")
        );
        return ResponseEntity.ok(session);
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
    // =====================================================
    // 7. ANNULER UNE SESSION
    // =====================================================
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        try {
            SessionQuiz session = sessionQuizService.cancelSession(id);
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =====================================================
    // 8. PASSER À LA QUESTION SUIVANTE
    // =====================================================
    @PostMapping("/{id}/next-question")
    public ResponseEntity<?> nextQuestion(@PathVariable Long id) {
        try {
            SessionQuiz session = sessionQuizService.nextQuestion(id);
            if (session.getStatut() == com.quizapp.model.enums.StatutSessionEnum.TERMINEE) {
                messagingTemplate.convertAndSend(
                        "/topic/session/" + id + "/status",
                        Map.of("statut", "TERMINEE")
                );
            } else {
                messagingTemplate.convertAndSend(
                        "/topic/session/" + id + "/question",
                        Map.of("questionIndex", session.getCurrentQuestionIndex())
                );
            }
            return ResponseEntity.ok(session);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    // =====================================================
// 9. GÉNÉRER LE QR CODE D'UNE SESSION
// =====================================================
/**
 * GET /api/sessions/{id}/qrcode
 * Retourne le QR Code en Base64.
 */
@GetMapping("/{id}/qrcode")
public ResponseEntity<?> getQrCode(@PathVariable Long id) {
    return sessionQuizService.findById(id)
            .map(session -> {
                // Le contenu du QR Code = un lien vers la page de join + le PIN
                // Exemple : http://localhost:3000/join?pin=847291
                String content = "http://localhost:3000/join?pin=" + session.getCodePIN();

                String qrCodeBase64 = qrCodeService.generateQrCodeBase64(content);

                return ResponseEntity.ok(Map.of(
                        "sessionId", session.getId(),
                        "codePIN", session.getCodePIN(),
                        "qrCode", qrCodeBase64
                ));
            })
            .orElse(ResponseEntity.notFound().build());
}

    // =====================================================
    // 10. RÉCUPÉRER LES QUESTIONS D'UNE SESSION (Pour étudiants et live)
    // =====================================================
    @GetMapping("/{id}/questions")
    public ResponseEntity<List<QuestionDTO>> getSessionQuestions(@PathVariable Long id) {
        return sessionQuizService.findById(id)
                .map(session -> ResponseEntity.ok(questionService.listForSession(session.getQcmId())))
                .orElse(ResponseEntity.notFound().build());
    }
}