package com.quizapp.dto;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor public class QuestionImportResultDTO {
    private int imported; private int rejected; @Builder.Default private List<String> errors=new ArrayList<>();
}
