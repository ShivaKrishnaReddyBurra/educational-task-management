package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/task-completion-rate")
    public ResponseEntity<List<Double>> getTaskCompletionRate(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject,
            @RequestParam(defaultValue = "weekly") String period) {
        List<Double> rates = taskService.getTaskCompletionRates(tutorId, studentId, subject, period);
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/subject-performance")
    public ResponseEntity<Map<String, List<Double>>> getSubjectPerformance(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "weekly") String period) {
        Map<String, List<Double>> performance = taskService.getSubjectPerformance(tutorId, studentId, period);
        return ResponseEntity.ok(performance);
    }

    @GetMapping("/grade-distribution")
    public ResponseEntity<Map<String, Double>> getGradeDistribution(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject) {
        Map<String, Double> distribution = taskService.getGradeDistribution(tutorId, studentId, subject);
        return ResponseEntity.ok(distribution);
    }

    @GetMapping("/submission-timeline")
    public ResponseEntity<Map<String, Double>> getSubmissionTimeline(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject) {
        Map<String, Double> timeline = taskService.getSubmissionTimeline(tutorId, studentId, subject);
        return ResponseEntity.ok(timeline);
    }
}