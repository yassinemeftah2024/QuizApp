package com.quizapp.dto;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.TypeQuestionEnum;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
@Data public class BankQuestionRequest {
    @NotBlank private String texte; @NotNull private TypeQuestionEnum type; private DifficulteEnum difficulte=DifficulteEnum.MOYEN;
    private Integer dureeSecondes=30; private Integer points=100; private String explication; private String mediaUrl; private String mediaType; private String mediaAlt;
    private Long matiereId; private Long categorieId; @Valid private List<CreateReponseRequest> reponses=new ArrayList<>();
}
