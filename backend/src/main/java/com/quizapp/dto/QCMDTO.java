package com.quizapp.dto;

import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.SourceGenerationEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QCMDTO {
    private Long id;
    private String titre;
    private String description;
    private String matiere;
    private Long matiereId;
    private String niveau;
    private DifficulteEnum difficulte;
    private List<Long> classeIds;
    private List<String> classeNoms;
    private ModeQuizEnum mode;
    private SourceGenerationEnum source;
    private Integer dureeMinutes;
    private Boolean publie;
    private Boolean archive;
    private Boolean shuffleQuestions;
    private Boolean showExplanations;
    private Boolean allowRetakes;
    private Boolean disponibleEntrainement;
    private Long enseignantId;
    private int nombreQuestions;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}
