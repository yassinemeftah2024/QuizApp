package com.quizapp.service;

import com.quizapp.model.Participation;
import com.quizapp.model.ReponseEtudiant;
import com.quizapp.repository.ParticipationRepository;
import com.quizapp.repository.ReponseEtudiantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReponseEtudiantService {

    private final ReponseEtudiantRepository reponseEtudiantRepository;
    private final ParticipationRepository participationRepository;

    /**
     * Enregistre la réponse d'un joueur.
     * Pour l'instant le score est passé en paramètre.
     * Plus tard on calculera automatiquement si c'est correct.
     */
    @Transactional
    public ReponseEtudiant submitAnswer(Long participationId,
                                        Long questionId,
                                        Long sessionId,
                                        List<Long> choixSelectionnes,
                                        Integer tempsReponse,
                                        Double scoreObtenu,
                                        boolean estCorrecte) {

        // Vérifier que le joueur n'a pas déjà répondu à cette question
        if (reponseEtudiantRepository.existsByParticipationIdAndQuestionId(participationId, questionId)) {
            throw new RuntimeException("Ce joueur a déjà répondu à cette question");
        }

        ReponseEtudiant reponse = ReponseEtudiant.builder()
                .participationId(participationId)
                .questionId(questionId)
                .sessionId(sessionId)
                .choixSelectionnes(choixSelectionnes)
                .tempsReponse(tempsReponse)
                .scoreObtenu(scoreObtenu)
                .estCorrecte(estCorrecte)
                .build();

        ReponseEtudiant saved = reponseEtudiantRepository.save(reponse);

        // Mettre à jour le score total de la participation
        Participation participation = participationRepository.findById(participationId)
                .orElseThrow(() -> new RuntimeException("Participation introuvable"));

        participation.setScoreTotal(participation.getScoreTotal() + scoreObtenu);
        if (tempsReponse != null) {
            participation.setTempsTotal(participation.getTempsTotal() + tempsReponse);
        }
        participationRepository.save(participation);

        return saved;
    }

    public List<ReponseEtudiant> getByParticipation(Long participationId) {
        return reponseEtudiantRepository.findByParticipationId(participationId);
    }

    public List<ReponseEtudiant> getBySession(Long sessionId) {
        return reponseEtudiantRepository.findBySessionId(sessionId);
    }
}