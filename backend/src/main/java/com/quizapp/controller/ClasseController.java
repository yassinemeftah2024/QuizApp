package com.quizapp.controller;

import com.quizapp.dto.ClasseDTO;
import com.quizapp.service.ClasseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/classes")
@RequiredArgsConstructor
public class ClasseController {

    private final ClasseService classeService;

    @GetMapping
    public ResponseEntity<List<ClasseDTO>> getAll() {
        return ResponseEntity.ok(classeService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClasseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClasseDTO> create(@Valid @RequestBody ClasseDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classeService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClasseDTO> update(@PathVariable Long id, @Valid @RequestBody ClasseDTO dto) {
        return ResponseEntity.ok(classeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
