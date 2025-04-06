package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.service.TaskService;
import com.edulink.taskmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private UserService userService;

    @GetMapping("/task-completion-rate")
    public ResponseEntity<List<Double>> getTaskCompletionRate(@RequestParam Long tutorId) {
        List<Double> rates = taskService.getWeeklyCompletionRates(tutorId);
        return ResponseEntity.ok(rates);
    }

    @GetMapping("/student-progress")
    public ResponseEntity<List<Double>> getStudentProgressOverTime(@RequestParam Long tutorId) {
        List<Double> progress = userService.getStudentProgressOverTime(tutorId);
        return ResponseEntity.ok(progress);
    }
}