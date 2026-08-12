package com.quizapp.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * SecurityConfig — Configuration Spring Security + JWT + CORS.
 *
 * Routes publiques (sans JWT) :
 *   - POST /auth/login, /auth/register
 *   - GET  /sessions/join/{pin}  ← Etudiant + Invité
 *
 * Routes protégées par rôle :
 *   - /admin/**    → ADMIN only
 *   - /teacher/**  → ENSEIGNANT only
 *   - /student/**  → ETUDIANT only
 *   - /ws/**       → WebSocket (dev-b)
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsService;
    private final RestSecurityErrorHandler restSecurityErrorHandler;

    // ─── Endpoints publics ─────────────────────────────────────────────
    private static final String[] PUBLIC_ENDPOINTS = {
            "/auth/**",
            "/sessions/join/**",   // Rejoindre via PIN (Etudiant + Invité)
            "/ws/**",              // WebSocket (géré séparément par dev-b)
            "/media/questions/**",
            "/actuator/health"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ── Désactiver CSRF (API REST stateless) ──
            .csrf(AbstractHttpConfigurer::disable)

            // ── CORS ──
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // ── Autorisation des routes ──
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                // Lecture publique des matières et classes (enseignants et étudiants en ont besoin)
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/matieres/**").authenticated()
                .requestMatchers(org.springframework.http.HttpMethod.GET, "/classes/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/teacher/**").hasRole("ENSEIGNANT")
                .requestMatchers("/student/**").hasAnyRole("ETUDIANT", "INVITE")
                .anyRequest().authenticated()
            )

            // ── Stateless (pas de session HTTP) ──
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ── Réponses JSON cohérentes pour 401 / 403 au niveau du filtre ──
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(restSecurityErrorHandler)
                .accessDeniedHandler(restSecurityErrorHandler)
            )

            // ── Provider d'authentification ──
            .authenticationProvider(authenticationProvider())

            // ── Ajouter le filtre JWT avant UsernamePasswordAuthenticationFilter ──
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ─── CORS Configuration ────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origines autorisées (frontend Vite dev + prod)
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",  // Vite default port
                "http://frontend:3000"    // Docker internal
        ));

        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept"
        ));

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ─── Authentication Provider ───────────────────────────────────────
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    // ─── Password Encoder (BCrypt) ─────────────────────────────────────
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ─── AuthenticationManager ─────────────────────────────────────────
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
