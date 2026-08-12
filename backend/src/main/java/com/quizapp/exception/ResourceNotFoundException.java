package com.quizapp.exception;

import org.springframework.http.HttpStatus;

/** Ressource demandée introuvable → HTTP 404. */
public class ResourceNotFoundException extends ApiException {
    public ResourceNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
