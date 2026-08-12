package com.quizapp.dto;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
@Data public class TrainingAnswerRequest {
    private Long questionId;
    private List<Long> reponseIds = new ArrayList<>();
    private String texteLibre;
}
