package com.quizapp.exception;

import org.springframework.http.HttpStatus;

/** Conflit d'état (ex. email déjà utilisé, code en double) → HTTP 409. */
public class ConflictException extends ApiException {
    public ConflictException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
