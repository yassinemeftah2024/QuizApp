package com.quizapp.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Corps d'erreur standard renvoyé par {@link GlobalExceptionHandler}.
 * Reflète le type {@code ApiError} du frontend :
 * {@code { status, message, errors?, timestamp }}.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private int status;
    private String message;
    /** Erreurs par champ (validation) — null si non applicable. */
    private Map<String, String> errors;
    private LocalDateTime timestamp;
}
