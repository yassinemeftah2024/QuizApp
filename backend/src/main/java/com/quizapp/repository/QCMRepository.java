package com.quizapp.repository;

import com.quizapp.model.QCM;
import com.quizapp.model.Enseignant;
import com.quizapp.model.enums.ModeQuizEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QCMRepository extends JpaRepository<QCM, Long> {

    List<QCM> findByEnseignantOrderByDateCreationDesc(Enseignant enseignant);

    List<QCM> findByEnseignantAndPublieTrue(Enseignant enseignant);

    long countByEnseignant(Enseignant enseignant);

    long countByEnseignantAndPublieTrue(Enseignant enseignant);

    @Query("SELECT COUNT(q) FROM QCM q")
    long countAllQuizzes();
    List<QCM> findByModeAndPublieTrueAndArchiveFalseOrderByDateCreationDesc(ModeQuizEnum mode);

    List<QCM> findByDisponibleEntrainementTrueAndPublieTrueAndArchiveFalseOrderByDateCreationDesc();
}
