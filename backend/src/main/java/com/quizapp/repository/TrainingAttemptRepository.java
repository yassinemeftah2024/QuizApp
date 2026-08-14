package com.quizapp.repository;
import com.quizapp.model.TrainingAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TrainingAttemptRepository extends JpaRepository<TrainingAttempt, Long> {
    List<TrainingAttempt> findByStudentIdOrderByDateTentativeDesc(Long studentId);
    boolean existsByStudentIdAndQcmId(Long studentId, Long qcmId);
}
