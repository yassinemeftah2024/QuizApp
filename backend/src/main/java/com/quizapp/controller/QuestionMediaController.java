package com.quizapp.controller;
import com.quizapp.service.QuestionMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
@RestController @RequestMapping("/teacher/question-media") @PreAuthorize("hasRole('ENSEIGNANT')") @RequiredArgsConstructor
public class QuestionMediaController {
    private final QuestionMediaService service;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String,String>> upload(@RequestParam("file") MultipartFile file) { return ResponseEntity.ok(Map.of("url", service.store(file), "type", file.getContentType() != null && file.getContentType().startsWith("video/") ? "VIDEO" : "IMAGE")); }
}
