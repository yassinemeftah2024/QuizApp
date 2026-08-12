package com.quizapp.controller;

import com.quizapp.dto.CreateQCMRequest;
import com.quizapp.dto.QCMDTO;
import com.quizapp.service.QCMService;
import com.quizapp.service.TeacherClassService;
import com.quizapp.dto.ClasseDTO;
import com.quizapp.dto.UtilisateurDTO;
import com.quizapp.dto.SubjectEnrollmentDTO;
import com.quizapp.model.Matiere;
import com.quizapp.service.StudentLearningService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TeacherController — CRUD Quiz pour les enseignants.
 * Routes protégées : hasRole('ENSEIGNANT').
 */
@RestController
@RequestMapping("/teacher")
@PreAuthorize("hasRole('ENSEIGNANT')")
@RequiredArgsConstructor
public class TeacherController {

    private final QCMService qcmService;
    private final TeacherClassService teacherClassService;
    private final StudentLearningService studentLearningService;

    @GetMapping("/subject-requests")
    public ResponseEntity<List<SubjectEnrollmentDTO>> subjectRequests() { return ResponseEntity.ok(studentLearningService.teacherPendingRequests()); }

    @PatchMapping("/subject-requests/{requestId}")
    public ResponseEntity<SubjectEnrollmentDTO> decideSubjectRequest(@PathVariable Long requestId, @RequestParam boolean approve) { return ResponseEntity.ok(studentLearningService.decide(requestId, approve)); }

    @GetMapping("/classes")
    public ResponseEntity<List<ClasseDTO>> getMyClasses() {
        return ResponseEntity.ok(teacherClassService.getMyClasses());
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Matiere>> getMySubjects() {
        return ResponseEntity.ok(teacherClassService.getMySubjects());
    }

    @GetMapping("/classes/{classeId}/students")
    public ResponseEntity<List<UtilisateurDTO>> getClassStudents(@PathVariable Long classeId) {
        return ResponseEntity.ok(teacherClassService.getStudents(classeId));
    }

    @GetMapping("/students/available")
    public ResponseEntity<List<UtilisateurDTO>> getAvailableStudents() {
        return ResponseEntity.ok(teacherClassService.getAvailableStudents());
    }

    @PatchMapping("/classes/{classeId}/students/{studentId}")
    public ResponseEntity<UtilisateurDTO> assignStudent(@PathVariable Long classeId, @PathVariable Long studentId) {
        return ResponseEntity.ok(teacherClassService.assignStudent(classeId, studentId));
    }

    @DeleteMapping("/classes/{classeId}/students/{studentId}")
    public ResponseEntity<UtilisateurDTO> removeStudent(@PathVariable Long classeId, @PathVariable Long studentId) {
        return ResponseEntity.ok(teacherClassService.removeStudent(classeId, studentId));
    }

    // ── My Quizzes ─────────────────────────────────────────────────────

    @GetMapping("/quizzes")
    public ResponseEntity<List<QCMDTO>> getMyQuizzes() {
        return ResponseEntity.ok(qcmService.getMyQuizzes());
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QCMDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(qcmService.getById(id));
    }

    @PostMapping("/quizzes")
    public ResponseEntity<QCMDTO> create(@Valid @RequestBody CreateQCMRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(qcmService.create(request));
    }

    @PutMapping("/quizzes/{id}")
    public ResponseEntity<QCMDTO> update(@PathVariable Long id, @Valid @RequestBody CreateQCMRequest request) {
        return ResponseEntity.ok(qcmService.update(id, request));
    }

    @PatchMapping("/quizzes/{id}/publish")
    public ResponseEntity<QCMDTO> publish(@PathVariable Long id) {
        return ResponseEntity.ok(qcmService.publish(id));
    }

    @PatchMapping("/quizzes/{id}/unpublish")
    public ResponseEntity<QCMDTO> unpublish(@PathVariable Long id) {
        return ResponseEntity.ok(qcmService.unpublish(id));
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        qcmService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
