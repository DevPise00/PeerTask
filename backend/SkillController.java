package com.peertask.api;

import com.peertask.api.dto.SkillRequest;
import com.peertask.api.dto.SkillResponse;
import com.peertask.api.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "*") // Tighten in production
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping
    public List<SkillResponse> list(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "All") String filter,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location) {
        return skillService.search(q, filter, category, location);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillResponse> get(@PathVariable String id) {
        return skillService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SkillResponse> create(@Valid @RequestBody SkillRequest request) {
        SkillResponse created = skillService.create(request);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillResponse> update(@PathVariable String id, @Valid @RequestBody SkillRequest request) {
        return skillService.update(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return skillService.delete(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
