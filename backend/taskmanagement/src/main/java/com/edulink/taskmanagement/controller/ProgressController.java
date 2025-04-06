package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.payload.request.ProgressRequest;
import com.edulink.taskmanagement.payload.request.ProgressSubmissionRequest;
import com.edulink.taskmanagement.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Progress>> getProgressByTask(@PathVariable Long taskId) {
        return ResponseEntity.ok(progressService.getProgressByTaskId(taskId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Progress>> getProgressByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(progressService.getProgressByStudent(studentId));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitProgress(@Valid @RequestBody ProgressSubmissionRequest submissionRequest, @RequestParam Long studentId) {
        Progress progress = progressService.submitProgress(submissionRequest, studentId);
        return ResponseEntity.ok(progress);
    }

    @PutMapping("/grade/{progressId}")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long progressId, @Valid @RequestBody ProgressRequest progressRequest, @RequestParam Long tutorId) {
        Progress gradedProgress = progressService.gradeSubmission(progressId, progressRequest, tutorId);
        return ResponseEntity.ok(gradedProgress);
    }

    @GetMapping("/statistics/task/{taskId}")
    public ResponseEntity<Map<String, Object>> getTaskStatistics(@PathVariable Long taskId) {
        return ResponseEntity.ok(progressService.getTaskStatistics(taskId));
    }
}