package com.quizapp.service;

import com.quizapp.model.Participation;
import com.quizapp.model.SessionQuiz;
import com.quizapp.model.enums.StatutSessionEnum;
import com.quizapp.repository.ParticipationRepository;
import com.quizapp.repository.SessionQuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ParticipationService {

    private final ParticipationRepository participationRepository;
    private final SessionQuizRepository sessionQuizRepository;

    /**
     * Un joueur rejoint une session avec un pseudonyme.
     */
    @Transactional
    public Participation joinSession(Long sessionId, String pseudonyme, Long utilisateurId) {

        // 1. Vérifier que la session existe
        SessionQuiz session = sessionQuizRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session introuvable"));

        // 2. Vérifier que la session n'est pas terminée ou annulée
        if (session.getStatut() == StatutSessionEnum.TERMINEE ||
            session.getStatut() == StatutSessionEnum.ANNULEE) {
            throw new RuntimeException("Impossible de rejoindre une session terminée ou annulée");
        }

        // 3. Vérifier le nombre max de participants
        if (session.getNombreMaxParticipants() != null) {
            long currentCount = participationRepository.countBySessionId(sessionId);
            if (currentCount >= session.getNombreMaxParticipants()) {
                throw new RuntimeException("La session est complète");
            }
        }

        // 4. Vérifier que le pseudonyme n'est pas déjà pris
        if (participationRepository.existsBySessionIdAndPseudonyme(sessionId, pseudonyme)) {
            throw new RuntimeException("Ce pseudonyme est déjà utilisé dans cette session");
        }

        // 5. Créer la participation
        Participation participation = Participation.builder()
                .sessionId(sessionId)
                .pseudonyme(pseudonyme)
                .utilisateurId(utilisateurId) // null si invité
                .scoreTotal(0.0)
                .tempsTotal(0L)
                .terminee(false)
                .build();

        return participationRepository.save(participation);
    }

    /**
     * Récupérer tous les participants d'une session.
     */
    public List<Participation> getParticipants(Long sessionId) {
        return participationRepository.findBySessionId(sessionId);
    }

    /**
     * Récupérer le classement d'une session (du meilleur au moins bon).
     */
    public List<Participation> getLeaderboard(Long sessionId) {
        return participationRepository.findBySessionIdOrderByScoreTotalDesc(sessionId);
    }
}