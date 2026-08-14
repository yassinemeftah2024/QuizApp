package com.quizapp.dto;

import com.quizapp.model.enums.ModeQuizEnum;
import com.quizapp.model.enums.DifficulteEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class CreateQCMRequest {
    @NotBlank(message = "Le titre est requis")
    private String titre;

    private String description;

    private String matiere;
    private Long matiereId;

    private String niveau;
    private DifficulteEnum difficulte = DifficulteEnum.MOYEN;
    private List<Long> classeIds = new ArrayList<>();

    @NotNull(message = "Le mode est requis")
    private ModeQuizEnum mode;

    private Integer dureeMinutes;

    private Boolean shuffleQuestions = false;
    private Boolean showExplanations = false;
    private Boolean allowRetakes = false;
    private Boolean disponibleEntrainement = false;
}
