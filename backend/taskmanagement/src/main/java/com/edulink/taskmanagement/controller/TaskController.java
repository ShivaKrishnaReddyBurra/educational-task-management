package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.payload.request.TaskRequest;
import com.edulink.taskmanagement.service.TaskService;
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

    @Autowired
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper; // Add ObjectMapper for JSON parsing

    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId) {
        try {
            return ResponseEntity.ok(taskService.getTaskById(taskId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Task> createTask(
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long tutorId) {
        try {
            TaskRequest taskRequest = objectMapper.readValue(taskJson, TaskRequest.class);
            taskRequest.setFile(file);
            Task task = taskService.createTask(taskRequest, tutorId);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping(value = "/{taskId}", consumes = {"multipart/form-data"})
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestPart("task") String taskJson,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long tutorId) {
        try {
            TaskRequest taskRequest = objectMapper.readValue(taskJson, TaskRequest.class);
            taskRequest.setFile(file);
            Task updatedTask = taskService.updateTask(taskId, taskRequest, tutorId);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Task>> getTasksByTutor(@PathVariable Long tutorId) {
        return ResponseEntity.ok(taskService.getTasksByTutor(tutorId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Task>> getTasksByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(taskService.getTasksByStudent(studentId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Task>> getUpcomingTasks(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(taskService.getUpcomingTasks(start, end));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<Task>> getOverdueTasks() {
        return ResponseEntity.ok(taskService.getOverdueTasks());
    }
}