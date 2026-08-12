package com.quizapp.controller;
import com.quizapp.dto.*;
import com.quizapp.service.QuestionBankService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
@RestController @RequestMapping("/teacher/question-bank") @PreAuthorize("hasRole('ENSEIGNANT')") @RequiredArgsConstructor
public class QuestionBankController {
    private final QuestionBankService service;
    @GetMapping public ResponseEntity<List<BankQuestionDTO>> search(@RequestParam(required=false) String search,@RequestParam(required=false) Long subjectId,@RequestParam(required=false) Long categoryId){return ResponseEntity.ok(service.search(search,subjectId,categoryId));}
    @PostMapping public ResponseEntity<BankQuestionDTO> create(@Valid @RequestBody BankQuestionRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(r));}
    @PutMapping("/{id}") public ResponseEntity<BankQuestionDTO> update(@PathVariable Long id,@Valid @RequestBody BankQuestionRequest r){return ResponseEntity.ok(service.update(id,r));}
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long id){service.delete(id);return ResponseEntity.noContent().build();}
    @PostMapping("/{id}/add-to-quiz/{quizId}") public ResponseEntity<QuestionDTO> add(@PathVariable Long id,@PathVariable Long quizId){return ResponseEntity.status(HttpStatus.CREATED).body(service.addToQuiz(id,quizId));}
    @GetMapping("/categories") public ResponseEntity<List<QuestionCategoryDTO>> categories(){return ResponseEntity.ok(service.categories());}
    @PostMapping("/categories") public ResponseEntity<QuestionCategoryDTO> category(@RequestBody Map<String,String> body){return ResponseEntity.status(HttpStatus.CREATED).body(service.createCategory(body.get("nom")));}
    @PostMapping(value="/import",consumes=MediaType.MULTIPART_FORM_DATA_VALUE) public ResponseEntity<QuestionImportResultDTO> importFile(@RequestParam("file") MultipartFile file){return ResponseEntity.ok(service.importExcel(file));}
    @GetMapping("/import/template") public ResponseEntity<ByteArrayResource> template(){byte[] b=service.template();return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=question-import-template.xlsx").contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).contentLength(b.length).body(new ByteArrayResource(b));}
}
