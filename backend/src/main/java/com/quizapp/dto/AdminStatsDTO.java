package com.quizapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsDTO {
    private long totalTeachers;
    private long totalStudents;
    private long totalAdmins;
    private long totalUsers;
    private long activeSessToday;
    private long totalQuizzes;
}
