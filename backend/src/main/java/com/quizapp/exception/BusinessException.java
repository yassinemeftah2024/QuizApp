package com.quizapp.exception;

import org.springframework.http.HttpStatus;

/** Règle métier violée / requête invalide → HTTP 400. */
public class BusinessException extends ApiException {
    public BusinessException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
