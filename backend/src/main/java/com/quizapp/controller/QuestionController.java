package com.quizapp.controller;

import com.quizapp.dto.CreateQuestionRequest;
import com.quizapp.dto.QuestionDTO;
import com.quizapp.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/teacher/quizzes/{quizId}/questions") @PreAuthorize("hasRole('ENSEIGNANT')") @RequiredArgsConstructor
public class QuestionController {
    private final QuestionService service;
    @GetMapping public ResponseEntity<List<QuestionDTO>> list(@PathVariable Long quizId) { return ResponseEntity.ok(service.list(quizId)); }
    @PostMapping public ResponseEntity<QuestionDTO> create(@PathVariable Long quizId, @Valid @RequestBody CreateQuestionRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(quizId, request)); }
    @PutMapping("/{questionId}") public ResponseEntity<QuestionDTO> update(@PathVariable Long quizId, @PathVariable Long questionId, @Valid @RequestBody CreateQuestionRequest request) { return ResponseEntity.ok(service.update(quizId, questionId, request)); }
    @PutMapping public ResponseEntity<List<QuestionDTO>> replace(@PathVariable Long quizId, @Valid @RequestBody List<CreateQuestionRequest> requests) { return ResponseEntity.ok(service.replaceAll(quizId, requests)); }
    @DeleteMapping("/{questionId}") public ResponseEntity<Void> delete(@PathVariable Long quizId, @PathVariable Long questionId) { service.delete(quizId, questionId); return ResponseEntity.noContent().build(); }
}
