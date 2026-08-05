package com.quizapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur de test public pour valider le bon fonctionnement de l'API.
 * Route configurée publique sous /auth/**
 */
@RestController
@RequestMapping("/auth")
public class TestAuthController {

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testBackend() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Le backend QuizApp fonctionne parfaitement !");
        response.put("status", "READY");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
