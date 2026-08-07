package com.quizapp.controller;

import com.quizapp.dto.SubmitAnswerRequest;
import com.quizapp.model.ReponseEtudiant;
import com.quizapp.service.ReponseEtudiantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reponses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReponseEtudiantController {

    private final ReponseEtudiantService reponseEtudiantService;

    @PostMapping
    public ResponseEntity<?> submitAnswer(@Valid @RequestBody SubmitAnswerRequest request) {
        try {
            ReponseEtudiant reponse = reponseEtudiantService.submitAnswer(
                    request.getParticipationId(),
                    request.getQuestionId(),
                    request.getSessionId(),
                    request.getChoixSelectionnes(),
                    request.getTempsReponse(),
                    request.getScoreObtenu() != null ? request.getScoreObtenu() : 0.0,
                    request.getEstCorrecte() != null ? request.getEstCorrecte() : false
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(reponse);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/participation/{participationId}")
    public ResponseEntity<List<ReponseEtudiant>> getByParticipation(@PathVariable Long participationId) {
        return ResponseEntity.ok(reponseEtudiantService.getByParticipation(participationId));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ReponseEtudiant>> getBySession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(reponseEtudiantService.getBySession(sessionId));
    }
}