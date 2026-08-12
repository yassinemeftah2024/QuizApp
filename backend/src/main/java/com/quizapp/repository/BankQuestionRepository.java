package com.quizapp.repository;
import com.quizapp.model.BankQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface BankQuestionRepository extends JpaRepository<BankQuestion,Long> {
    @Query("select q from BankQuestion q where q.enseignant.id=:teacherId and (:search is null or lower(q.texte) like lower(concat('%',:search,'%'))) and (:subjectId is null or q.matiere.id=:subjectId) and (:categoryId is null or q.categorie.id=:categoryId) order by q.dateCreation desc")
    List<BankQuestion> search(@Param("teacherId") Long teacherId,@Param("search") String search,@Param("subjectId") Long subjectId,@Param("categoryId") Long categoryId);
}
