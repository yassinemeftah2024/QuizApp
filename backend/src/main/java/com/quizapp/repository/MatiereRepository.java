package com.quizapp.repository;

import com.quizapp.model.Matiere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MatiereRepository extends JpaRepository<Matiere, Long> {
    Optional<Matiere> findByNom(String nom);
    Optional<Matiere> findByCode(String code);
    boolean existsByNom(String nom);
    boolean existsByCode(String code);
}
