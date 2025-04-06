package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.payload.request.TaskRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface TaskService {
    Task createTask(TaskRequest taskRequest, Long tutorId);
    Task updateTask(Long id, TaskRequest taskRequest, Long tutorId);
    void deleteTask(Long id);
    Task getTaskById(Long id);
    List<Task> getAllTasks();
    List<Task> getTasksByTutor(Long tutorId);
    List<Task> getTasksByStudent(Long studentId);
    List<Task> getUpcomingTasks(LocalDateTime start, LocalDateTime end);
    List<Task> getOverdueTasks();
    List<Double> getWeeklyCompletionRates(Long tutorId);
    List<Double> getTaskCompletionRates(Long tutorId, Long studentId, String subject, String period);
    Map<String, List<Double>> getSubjectPerformance(Long tutorId, Long studentId, String period);
    Map<String, Double> getGradeDistribution(Long tutorId, Long studentId, String subject);
    Map<String, Double> getSubmissionTimeline(Long tutorId, Long studentId, String subject);

    // New methods for Calendar
    List<Task> getTasksForMonth(Long userId, String role, int year, int month);
    List<Task> getUpcomingEvents(Long userId, String role, LocalDateTime from);
}