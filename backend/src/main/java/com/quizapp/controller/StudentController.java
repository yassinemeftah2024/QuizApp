package com.quizapp.controller;

import com.quizapp.dto.QCMDTO;
import com.quizapp.dto.SubjectEnrollmentDTO;
import com.quizapp.service.StudentLearningService;
import com.quizapp.service.TrainingService;
import com.quizapp.dto.TrainingQuizDTO;
import com.quizapp.dto.TrainingResultDTO;
import com.quizapp.dto.TrainingHistoryDTO;
import com.quizapp.dto.TrainingSubmissionRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/student") @PreAuthorize("hasRole('ETUDIANT')") @RequiredArgsConstructor
public class StudentController {
    private final StudentLearningService service;
    private final TrainingService trainingService;
    @GetMapping("/training") public ResponseEntity<List<QCMDTO>> training() { return ResponseEntity.ok(trainingService.available()); }
    @GetMapping("/training/{quizId}") public ResponseEntity<TrainingQuizDTO> trainingQuiz(@PathVariable Long quizId) { return ResponseEntity.ok(trainingService.quiz(quizId)); }
    @PostMapping("/training/{quizId}/attempts") public ResponseEntity<TrainingResultDTO> submitTraining(@PathVariable Long quizId, @Valid @RequestBody TrainingSubmissionRequest request) { return ResponseEntity.ok(trainingService.submit(quizId, request)); }
    @GetMapping("/training-history") public ResponseEntity<List<TrainingHistoryDTO>> trainingHistory() { return ResponseEntity.ok(trainingService.history()); }
    @GetMapping("/subjects/requests") public ResponseEntity<List<SubjectEnrollmentDTO>> requests() { return ResponseEntity.ok(service.myRequests()); }
    @PostMapping("/subjects/{subjectId}/request") public ResponseEntity<SubjectEnrollmentDTO> request(@PathVariable Long subjectId) { return ResponseEntity.ok(service.requestSubject(subjectId)); }
}
