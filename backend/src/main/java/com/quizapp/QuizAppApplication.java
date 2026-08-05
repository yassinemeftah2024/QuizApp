package com.quizapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * QuizApp — Point d'entrée principal de l'application Spring Boot.
 * Plateforme de quiz interactifs en temps réel (type Kahoot!).
 *
 * @author dev-a
 */
@SpringBootApplication
public class QuizAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(QuizAppApplication.class, args);
    }
}
