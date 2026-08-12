package com.quizapp.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.quizapp.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Traduit les échecs de sécurité *au niveau du filtre* (avant d'atteindre un
 * contrôleur) en réponses JSON cohérentes avec {@code ApiError} du frontend.
 *
 * - {@link AuthenticationEntryPoint} : requête non authentifiée → 401.
 * - {@link AccessDeniedHandler}      : authentifié mais rôle insuffisant → 403.
 *
 * Ces cas ne passent PAS par le {@code GlobalExceptionHandler} (ils sont gérés
 * par la chaîne de filtres Spring Security), d'où ce composant dédié.
 */
@Component
@RequiredArgsConstructor
public class RestSecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        write(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentification requise.");
    }

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException accessDeniedException) throws IOException {
        write(response, HttpServletResponse.SC_FORBIDDEN,
                "Vous n'avez pas les droits nécessaires pour cette action.");
    }

    private void write(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ErrorResponse body = ErrorResponse.builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        objectMapper.writeValue(response.getWriter(), body);
    }
}
