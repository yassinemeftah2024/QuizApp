package com.quizapp.repository;
import com.quizapp.model.QuestionCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface QuestionCategoryRepository extends JpaRepository<QuestionCategory,Long> {
    List<QuestionCategory> findByEnseignantIdOrderByNomAsc(Long teacherId);
    Optional<QuestionCategory> findByEnseignantIdAndNomIgnoreCase(Long teacherId,String nom);
}
