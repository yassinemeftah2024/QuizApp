package com.quizapp.dto;
import com.quizapp.model.enums.DifficulteEnum;
import com.quizapp.model.enums.TypeQuestionEnum;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor public class BankQuestionDTO {
    private Long id; private String texte; private TypeQuestionEnum type; private DifficulteEnum difficulte; private Integer dureeSecondes; private Integer points;
    private String explication; private String mediaUrl; private String mediaType; private String mediaAlt; private Long matiereId; private String matiereNom;
    private Long categorieId; private String categorieNom; private List<ReponseDTO> reponses; private LocalDateTime dateCreation;
}
