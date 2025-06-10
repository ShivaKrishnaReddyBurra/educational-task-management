package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:3000")
public class StatisticsController {

    private static final Logger logger = LoggerFactory.getLogger(StatisticsController.class);

    @Autowired
    private TaskService taskService;

    @GetMapping("/task-completion-rate")
    public ResponseEntity<List<Double>> getTaskCompletionRate(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject,
            @RequestParam(defaultValue = "weekly") String period) {
        logger.info("Fetching task completion rate for tutorId: {}, studentId: {}, subject: {}, period: {}", 
                    tutorId, studentId, subject, period);
        try {
            List<Double> rates = taskService.getTaskCompletionRates(tutorId, studentId, subject, period);
            logger.debug("Task completion rates retrieved: {}", rates);
            return ResponseEntity.ok(rates);
        } catch (Exception e) {
            logger.error("Error fetching task completion rate: tutorId={}, studentId={}, subject={}, period={}", 
                         tutorId, studentId, subject, period, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/subject-performance")
    public ResponseEntity<Map<String, List<Double>>> getSubjectPerformance(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "weekly") String period) {
        logger.info("Fetching subject performance for tutorId: {}, studentId: {}, period: {}", 
                    tutorId, studentId, period);
        try {
            Map<String, List<Double>> performance = taskService.getSubjectPerformance(tutorId, studentId, period);
            logger.debug("Subject performance retrieved: {}", performance);
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            logger.error("Error fetching subject performance: tutorId={}, studentId={}, period={}", 
                         tutorId, studentId, period, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/grade-distribution")
    public ResponseEntity<Map<String, Double>> getGradeDistribution(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject) {
        logger.info("Fetching grade distribution for tutorId: {}, studentId: {}, subject: {}", 
                    tutorId, studentId, subject);
        try {
            Map<String, Double> distribution = taskService.getGradeDistribution(tutorId, studentId, subject);
            logger.debug("Grade distribution retrieved: {}", distribution);
            return ResponseEntity.ok(distribution);
        } catch (Exception e) {
            logger.error("Error fetching grade distribution: tutorId={}, studentId={}, subject={}", 
                         tutorId, studentId, subject, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/submission-timeline")
    public ResponseEntity<Map<String, Double>> getSubmissionTimeline(
            @RequestParam Long tutorId,
            @RequestParam(required = false) Long studentId,
            @RequestParam(defaultValue = "all-subjects") String subject) {
        logger.info("Fetching submission timeline for tutorId: {}, studentId: {}, subject: {}", 
                    tutorId, studentId, subject);
        try {
            Map<String, Double> timeline = taskService.getSubmissionTimeline(tutorId, studentId, subject);
            logger.debug("Submission timeline retrieved: {}", timeline);
            return ResponseEntity.ok(timeline);
        } catch (Exception e) {
            logger.error("Error fetching submission timeline: tutorId={}, studentId={}, subject={}", 
                         tutorId, studentId, subject, e);
            return ResponseEntity.badRequest().build();
        }
    }
}