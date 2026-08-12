package com.quizapp.config;
import com.quizapp.service.QuestionMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration @RequiredArgsConstructor
public class QuestionMediaConfig implements WebMvcConfigurer {
    private final QuestionMediaService mediaService;
    @Override public void addResourceHandlers(ResourceHandlerRegistry registry) { registry.addResourceHandler("/media/questions/**").addResourceLocations(mediaService.root().toUri().toString()); }
}
