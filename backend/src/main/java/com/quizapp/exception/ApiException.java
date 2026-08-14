package com.quizapp.exception;

import org.springframework.http.HttpStatus;

/**
 * Exception métier de base. Porte le {@link HttpStatus} à renvoyer au client,
 * ce qui permet au {@link GlobalExceptionHandler} de traduire chaque erreur
 * en 400/403/404/409 au lieu d'un 500 générique.
 */
public class ApiException extends RuntimeException {

    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
