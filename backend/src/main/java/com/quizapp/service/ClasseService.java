package com.quizapp.service;

import com.quizapp.dto.ClasseDTO;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.model.Classe;
import com.quizapp.repository.ClasseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClasseService {

    private final ClasseRepository classeRepository;

    public List<ClasseDTO> findAll() {
        return classeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ClasseDTO findById(Long id) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
        return toDTO(classe);
    }

    @Transactional
    public ClasseDTO create(ClasseDTO dto) {
        Classe classe = Classe.builder()
                .nom(dto.getNom())
                .niveau(dto.getNiveau())
                .section(dto.getSection())
                .anneeAcademique(dto.getAnneeAcademique())
                .build();
        return toDTO(classeRepository.save(classe));
    }

    @Transactional
    public ClasseDTO update(Long id, ClasseDTO dto) {
        Classe classe = classeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée"));
        classe.setNom(dto.getNom());
        classe.setNiveau(dto.getNiveau());
        classe.setSection(dto.getSection());
        classe.setAnneeAcademique(dto.getAnneeAcademique());
        return toDTO(classeRepository.save(classe));
    }

    @Transactional
    public void delete(Long id) {
        classeRepository.deleteById(id);
    }
    
    private ClasseDTO toDTO(Classe c) {
        return ClasseDTO.builder()
                .id(c.getId())
                .nom(c.getNom())
                .niveau(c.getNiveau())
                .section(c.getSection())
                .anneeAcademique(c.getAnneeAcademique())
                .nombreEtudiants(c.getEtudiants() != null ? c.getEtudiants().size() : 0)
                .build();
    }
}
