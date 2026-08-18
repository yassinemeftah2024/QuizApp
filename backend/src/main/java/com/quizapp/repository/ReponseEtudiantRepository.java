package com.quizapp.repository;

import com.quizapp.model.ReponseEtudiant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReponseEtudiantRepository extends JpaRepository<ReponseEtudiant, Long> {

    // Toutes les réponses d'une participation
    List<ReponseEtudiant> findByParticipationId(Long participationId);

    // Toutes les réponses d'une session
    List<ReponseEtudiant> findBySessionId(Long sessionId);

    // Réponse d'un joueur à une question précise
    Optional<ReponseEtudiant> findByParticipationIdAndQuestionId(Long participationId, Long questionId);

    // Toutes les réponses à une question dans une session
    List<ReponseEtudiant> findBySessionIdAndQuestionId(Long sessionId, Long questionId);

    // Nombre de réponses à une question dans une session
    long countBySessionIdAndQuestionId(Long sessionId, Long questionId);

    // Vérifier si un joueur a déjà répondu à une question
    boolean existsByParticipationIdAndQuestionId(Long participationId, Long questionId);
}