package com.quizapp.repository;

import com.quizapp.model.SessionQuiz;
import com.quizapp.model.enums.StatutSessionEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionQuizRepository extends JpaRepository<SessionQuiz, Long> {

    Optional<SessionQuiz> findByCodePIN(String codePIN);
    boolean existsByCodePIN(String codePIN);
    Optional<SessionQuiz> findByQrCodeToken(String qrCodeToken);
    List<SessionQuiz> findByCreatedBy(Long createdBy);
    List<SessionQuiz> findByCreatedByAndStatut(Long createdBy, StatutSessionEnum statut);
    List<SessionQuiz> findByStatut(StatutSessionEnum statut);
}