package com.quizapp.controller;

import com.quizapp.dto.MatiereDTO;
import com.quizapp.model.Matiere;
import com.quizapp.service.MatiereService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matieres")
@RequiredArgsConstructor
public class MatiereController {

    private final MatiereService matiereService;

    @GetMapping
    public ResponseEntity<List<Matiere>> getAll() {
        return ResponseEntity.ok(matiereService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Matiere> getById(@PathVariable Long id) {
        return ResponseEntity.ok(matiereService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Matiere> create(@Valid @RequestBody MatiereDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matiereService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Matiere> update(@PathVariable Long id, @Valid @RequestBody MatiereDTO dto) {
        return ResponseEntity.ok(matiereService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        matiereService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
