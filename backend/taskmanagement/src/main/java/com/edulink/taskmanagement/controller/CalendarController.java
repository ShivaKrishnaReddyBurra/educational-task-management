package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:3000")
public class CalendarController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasksForMonth(
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam int year,
            @RequestParam int month) {
        List<Task> tasks = taskService.getTasksForMonth(userId, role, year, month);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingEvents(
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam String from) { // ISO format: "2025-04-06T00:00:00"
        LocalDateTime fromDate = LocalDateTime.parse(from);
        List<Task> events = taskService.getUpcomingEvents(userId, role, fromDate);
        return ResponseEntity.ok(events);
    }
}