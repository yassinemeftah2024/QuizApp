package com.quizapp.service;

import com.quizapp.exception.BusinessException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Set;
import java.util.UUID;

@Service
public class QuestionMediaService {
    private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm");
    private final Path root;
    public QuestionMediaService(@Value("${application.media.question-path:uploads/questions}") String root) { this.root = Path.of(root).toAbsolutePath().normalize(); }
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new BusinessException("Select an image or video");
        if (!ALLOWED.contains(file.getContentType())) throw new BusinessException("Supported media: JPG, PNG, WebP, GIF, MP4 and WebM");
        String filename = UUID.randomUUID() + extension(file.getOriginalFilename(), file.getContentType());
        try { Files.createDirectories(root); Files.copy(file.getInputStream(), root.resolve(filename), StandardCopyOption.REPLACE_EXISTING); return "/api/media/questions/" + filename; }
        catch (IOException ex) { throw new BusinessException("Unable to store question media"); }
    }
    public Path root() { return root; }
    private String extension(String name, String type) { if (name != null && name.lastIndexOf('.') >= 0) return name.substring(name.lastIndexOf('.')).toLowerCase(); return type != null && type.startsWith("video/") ? ".mp4" : ".jpg"; }
}
