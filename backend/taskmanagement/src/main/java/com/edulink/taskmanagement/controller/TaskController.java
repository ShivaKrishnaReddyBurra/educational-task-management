package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.payload.request.TaskRequest;
import com.edulink.taskmanagement.service.TaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:3000")
public class TaskController {

    private static final Logger logger = LoggerFactory.getLogger(TaskController.class);

    @Autowired
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        logger.info("Fetching all tasks");
        try {
            List<Task> tasks = taskService.getAllTasks();
            logger.debug("Tasks retrieved: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching all tasks", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        logger.info("Fetching task with taskId: {}", taskId);
        try {
            Task task = taskService.getTaskById(taskId);
            logger.debug("Task retrieved: {}", task.getId());
            return ResponseEntity.ok(task);
        } catch (RuntimeException e) {
            logger.error("Error fetching task with taskId: {}", taskId, e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Task> createTask(
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long tutorId) {
        logger.info("Creating task for tutorId: {}", tutorId);
        try {
            TaskRequest taskRequest = objectMapper.readValue(taskJson, TaskRequest.class);
            taskRequest.setFile(file);
            Task task = taskService.createTask(taskRequest, tutorId);
            logger.info("Task created successfully: {}", task.getId());
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            logger.error("Error creating task for tutorId: {}", tutorId, e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping(value = "/{taskId}", consumes = {"multipart/form-data"})
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long tutorId) {
        logger.info("Updating task with taskId: {}, tutorId: {}", taskId, tutorId);
        try {
            TaskRequest taskRequest = objectMapper.readValue(taskJson, TaskRequest.class);
            taskRequest.setFile(file);
            Task updatedTask = taskService.updateTask(taskId, taskRequest, tutorId);
            logger.info("Task {} updated successfully", taskId);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            logger.error("Error updating task with taskId: {}, tutorId: {}", taskId, tutorId, e);
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        logger.info("Deleting task with taskId: {}", taskId);
        try {
            taskService.deleteTask(taskId);
            logger.info("Task {} deleted successfully", taskId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting task with taskId: {}", taskId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Task>> getTasksByTutor(@PathVariable Long tutorId) {
        logger.info("Fetching tasks for tutorId: {}", tutorId);
        try {
            List<Task> tasks = taskService.getTasksByTutor(tutorId);
            logger.debug("Tasks retrieved for tutor: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks for tutorId: {}", tutorId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Task>> getTasksByStudent(@PathVariable Long studentId) {
        logger.info("Fetching tasks for studentId: {}", studentId);
        try {
            List<Task> tasks = taskService.getTasksByStudent(studentId);
            logger.debug("Tasks retrieved for student: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching tasks for studentId: {}", studentId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingTasks(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        logger.info("Fetching upcoming tasks from {} to {}", start, end);
        try {
            List<Task> tasks = taskService.getUpcomingTasks(start, end);
            logger.debug("Upcoming tasks retrieved: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching upcoming tasks from {} to {}", start, end, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        logger.info("Fetching overdue tasks");
        try {
            List<Task> tasks = taskService.getOverdueTasks();
            logger.debug("Overdue tasks retrieved: {}", tasks.size());
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            logger.error("Error fetching overdue tasks", e);
            return ResponseEntity.badRequest().build();
        }
    }
}