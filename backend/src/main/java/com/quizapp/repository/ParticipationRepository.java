package com.quizapp.repository;

import com.quizapp.model.Participation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipationRepository extends JpaRepository<Participation, Long> {

    // Toutes les participations d'une session
    List<Participation> findBySessionId(Long sessionId);

    // Trouver une participation précise dans une session
    Optional<Participation> findBySessionIdAndPseudonyme(Long sessionId, String pseudonyme);

    // Vérifier si un pseudonyme est déjà pris dans une session
    boolean existsBySessionIdAndPseudonyme(Long sessionId, String pseudonyme);

    // Classement d'une session (du meilleur score au moins bon)
    List<Participation> findBySessionIdOrderByScoreTotalDesc(Long sessionId);

    // Nombre de participants d'une session
    long countBySessionId(Long sessionId);
}