package com.quizapp.service;

import com.quizapp.dto.MatiereDTO;
import com.quizapp.exception.ConflictException;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Matiere;
import com.quizapp.repository.MatiereRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatiereService {

    private final MatiereRepository matiereRepository;

    public List<Matiere> findAll() {
        return matiereRepository.findAll();
    }

    public Matiere findById(Long id) {
        return matiereRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Matière introuvable avec l'id: " + id));
    }

    @Transactional
    public Matiere create(MatiereDTO dto) {
        if (matiereRepository.existsByNom(dto.getNom())) {
            throw new ConflictException("Une matière avec ce nom existe déjà.");
        }
        if (matiereRepository.existsByCode(dto.getCode())) {
            throw new ConflictException("Une matière avec ce code existe déjà.");
        }
        Matiere matiere = Matiere.builder()
                .nom(dto.getNom())
                .code(dto.getCode().toUpperCase())
                .couleur(dto.getCouleur() != null ? dto.getCouleur() : "#6366f1")
                .description(dto.getDescription())
                .build();
        return matiereRepository.save(matiere);
    }

    @Transactional
    public Matiere update(Long id, MatiereDTO dto) {
        Matiere matiere = findById(id);
        matiere.setNom(dto.getNom());
        matiere.setCode(dto.getCode().toUpperCase());
        if (dto.getCouleur() != null) {
            matiere.setCouleur(dto.getCouleur());
        }
        matiere.setDescription(dto.getDescription());
        return matiereRepository.save(matiere);
    }

    @Transactional
    public void delete(Long id) {
        if (!matiereRepository.existsById(id)) {
            throw new ResourceNotFoundException("Matière introuvable avec l'id: " + id);
        }
        matiereRepository.deleteById(id);
    }
}
