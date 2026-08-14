package com.quizapp.exception;

import org.springframework.http.HttpStatus;

/** Action non autorisée pour l'utilisateur courant → HTTP 403. */
public class ForbiddenException extends ApiException {
    public ForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
