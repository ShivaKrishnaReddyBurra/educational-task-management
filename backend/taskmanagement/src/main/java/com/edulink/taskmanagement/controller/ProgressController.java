package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.payload.request.ProgressRequest;
import com.edulink.taskmanagement.payload.request.ProgressSubmissionRequest;
import com.edulink.taskmanagement.service.ProgressService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private static final Logger logger = LoggerFactory.getLogger(ProgressController.class);

    @Autowired
    private ProgressService progressService;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Progress>> getProgressByTask(@PathVariable Long taskId) {
        logger.info("Fetching progress for taskId: {}", taskId);
        try {
            List<Progress> progress = progressService.getProgressByTaskId(taskId);
            logger.debug("Progress retrieved for taskId: {}, count: {}", taskId, progress.size());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error fetching progress for taskId: {}", taskId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Progress>> getProgressByStudent(@PathVariable Long studentId) {
        logger.info("Fetching progress for studentId: {}", studentId);
        try {
            List<Progress> progress = progressService.getProgressByStudent(studentId);
            logger.debug("Progress retrieved for studentId: {}, count: {}", studentId, progress.size());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error fetching progress for studentId: {}", studentId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitProgress(@Valid @RequestBody ProgressSubmissionRequest submissionRequest, @RequestParam Long studentId) {
        logger.info("Submitting progress for studentId: {}", studentId);
        try {
            Progress progress = progressService.submitProgress(submissionRequest, studentId);
            logger.info("Progress submitted successfully for studentId: {}", studentId);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error submitting progress for studentId: {}", studentId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/grade/{progressId}")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long progressId, @Valid @RequestBody ProgressRequest progressRequest, @RequestParam Long tutorId) {
        logger.info("Grading submission with progressId: {}, tutorId: {}", progressId, tutorId);
        try {
            Progress gradedProgress = progressService.gradeSubmission(progressId, progressRequest, tutorId);
            logger.info("Submission graded successfully for progressId: {}", progressId);
            return ResponseEntity.ok(gradedProgress);
        } catch (Exception e) {
            logger.error("Error grading submission for progressId: {}, tutorId: {}", progressId, tutorId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/statistics/task/{taskId}")
    public ResponseEntity<Map<String, Object>> getTaskStatistics(@PathVariable Long taskId) {
        logger.info("Fetching task statistics for taskId: {}", taskId);
        try {
            Map<String, Object> stats = progressService.getTaskStatistics(taskId);
            logger.debug("Task statistics retrieved for taskId: {}", taskId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching task statistics for taskId: {}", taskId, e);
            return ResponseEntity.badRequest().build();
        }
    }
}