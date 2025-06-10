package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:3000")
public class CalendarController {

    private static final Logger logger = LoggerFactory.getLogger(CalendarController.class);

    @Autowired
    private TaskService taskService;

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTasksForMonth(
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam int year,
            @RequestParam int month) {
        logger.info("Fetching tasks for userId: {}, role: {}, year: {}, month: {}", userId, role, year, month);
        try {
            List<Task> tasks = taskService.getTasksForMonth(userId, role, year, month);
            logger.debug("Tasks retrieved: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks for userId: {}, role: {}, year: {}, month: {}", 
                         userId, role, year, month, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingEvents(
            @RequestParam Long userId,
            @RequestParam String role,
            @RequestParam String from) {
        logger.info("Fetching upcoming events for userId: {}, role: {}, from: {}", userId, role, from);
        try {
            LocalDateTime fromDate = LocalDateTime.parse(from);
            List<Task> events = taskService.getUpcomingEvents(userId, role, fromDate);
            logger.debug("Upcoming events retrieved: {}", events.size());
            return ResponseEntity.ok(events);
        } catch (Exception e) {
            logger.error("Error fetching upcoming events for userId: {}, role: {}, from: {}", 
                         userId, role, from, e);
            return ResponseEntity.badRequest().build();
        }
    }
}