package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.service.TaskService;
import com.edulink.taskmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping("/task-completion-rate")
    public ResponseEntity<List<Double>> getTaskCompletionRate(@RequestParam Long tutorId) {
        logger.info("Fetching task completion rate for tutorId: {}", tutorId);
        try {
            List<Double> rates = taskService.getWeeklyCompletionRates(tutorId);
            logger.debug("Task completion rates retrieved: {}", rates);
            return ResponseEntity.ok(rates);
        } catch (Exception e) {
            logger.error("Error fetching task completion rate for tutorId: {}", tutorId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/student-progress")
    public ResponseEntity<List<Double>> getStudentProgressOverTime(@RequestParam Long tutorId) {
        logger.info("Fetching student progress for tutorId: {}", tutorId);
        try {
            List<Double> progress = userService.getStudentProgressOverTime(tutorId);
            logger.debug("Student progress retrieved: {}", progress);
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            logger.error("Error fetching student progress for tutorId: {}", tutorId, e);
            return ResponseEntity.badRequest().build();
        }
    }
}