package com.quizapp.repository;

import com.quizapp.model.SubjectEnrollmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubjectEnrollmentRequestRepository extends JpaRepository<SubjectEnrollmentRequest, Long> {
    Optional<SubjectEnrollmentRequest> findByStudentIdAndMatiereId(Long studentId, Long matiereId);
    List<SubjectEnrollmentRequest> findByStudentId(Long studentId);
    List<SubjectEnrollmentRequest> findByStatus(String status);
}
