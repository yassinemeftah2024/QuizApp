package com.quizapp.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class TeacherAssignmentsRequest {
    private List<Long> matiereIds = new ArrayList<>();
    private List<Long> classeIds = new ArrayList<>();
}
