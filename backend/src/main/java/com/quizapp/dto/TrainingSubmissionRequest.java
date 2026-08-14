package com.quizapp.dto;
import jakarta.validation.Valid;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;
@Data public class TrainingSubmissionRequest {
    @Valid private List<TrainingAnswerRequest> reponses = new ArrayList<>();
}
