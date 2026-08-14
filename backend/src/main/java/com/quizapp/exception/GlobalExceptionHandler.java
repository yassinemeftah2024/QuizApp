package com.quizapp.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — traduit les exceptions en réponses HTTP cohérentes.
 *
 * Le corps renvoyé respecte le type {@code ApiError} du frontend :
 * {@code { status, message, errors?, timestamp }}.
 *
 * Sans ce handler, chaque {@code RuntimeException} remontait en 500. Désormais :
 *   - {@link ApiException} et ses sous-types → 400/403/404/409 selon le cas
 *   - validation Bean (@Valid) → 400 + détail par champ
 *   - mauvais identifiants → 401
 *   - accès refusé (rôle) → 403
 *   - violation d'intégrité BD → 409
 *   - tout le reste → 500 (journalisé)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Exceptions métier typées (404, 409, 400, 403…). */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApiException(ApiException ex) {
        return build(ex.getStatus(), ex.getMessage(), null);
    }

    /** Échec de validation @Valid sur un @RequestBody → 400 + erreurs par champ. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return build(HttpStatus.BAD_REQUEST, "Certains champs sont invalides.", fieldErrors);
    }

    /** Corps de requête illisible / JSON malformé → 400. */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadable(HttpMessageNotReadableException ex) {
        return build(HttpStatus.BAD_REQUEST, "Le corps de la requête est invalide ou mal formé.", null);
    }

    /** Mauvais email / mot de passe lors du login → 401. */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Email ou mot de passe incorrect.", null);
    }

    /** Autres échecs d'authentification → 401. */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthentication(AuthenticationException ex) {
        return build(HttpStatus.UNAUTHORIZED, "Authentification requise.", null);
    }

    /** Accès refusé par la sécurité de méthode (@PreAuthorize) → 403. */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        return build(HttpStatus.FORBIDDEN, "Vous n'avez pas les droits nécessaires pour cette action.", null);
    }

    /** Violation de contrainte en base (unicité, clé étrangère…) → 409. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.warn("Violation d'intégrité des données", ex);
        return build(HttpStatus.CONFLICT,
                "Cette opération viole une contrainte de données (doublon ou référence manquante).", null);
    }

    /** Filet de sécurité — toute exception non prévue → 500 (journalisée). */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Erreur non gérée sur {} {}", request.getMethod(), request.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR,
                "Une erreur interne est survenue. Veuillez réessayer plus tard.", null);
    }

    // ── Helper ────────────────────────────────────────────────────────

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, Map<String, String> errors) {
        ErrorResponse body = ErrorResponse.builder()
                .status(status.value())
                .message(message)
                .errors(errors)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(status).body(body);
    }
}
