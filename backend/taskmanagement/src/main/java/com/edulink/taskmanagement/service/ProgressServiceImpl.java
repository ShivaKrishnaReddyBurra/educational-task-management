package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.payload.request.ProgressRequest;
import com.edulink.taskmanagement.payload.request.ProgressSubmissionRequest;
import com.edulink.taskmanagement.repository.ProgressRepository;
import com.edulink.taskmanagement.repository.TaskRepository;
import com.edulink.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressServiceImpl implements ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Progress submitProgress(ProgressSubmissionRequest submissionRequest, Long studentId) {
        Task task = taskRepository.findById(submissionRequest.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!task.getAssignees().contains(student)) {
            throw new RuntimeException("Task not assigned to this student");
        }

        if (LocalDateTime.now().isAfter(task.getDeadline())) {
            throw new RuntimeException("Cannot submit past deadline");
        }

        Progress progress = new Progress();
        progress.setTask(task);
        progress.setStudent(student);
        progress.setPercentageComplete(submissionRequest.getPercentageComplete());
        progress.setComment(submissionRequest.getComment());
        progress.setSubmissionUrl(submissionRequest.getSubmissionUrl());
        progress.setSubmittedAt(LocalDateTime.now());

        Progress savedProgress = progressRepository.save(progress);

        if (submissionRequest.getPercentageComplete() == 100) {
            task.setStatus("COMPLETED");
            taskRepository.save(task);
        }

        return savedProgress;
    }

    @Override
    public Progress gradeSubmission(Long progressId, ProgressRequest progressRequest, Long tutorId) {
        Progress progress = progressRepository.findById(progressId)
                .orElseThrow(() -> new RuntimeException("Progress not found"));

        User tutor = userRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        if (!progress.getTask().getCreatedBy().equals(tutor)) {
            throw new RuntimeException("Only the task creator can grade");
        }

        progress.setScore(progressRequest.getScore());
        progress.setComment(progressRequest.getFeedback() != null ? progressRequest.getFeedback() : progress.getComment());
        return progressRepository.save(progress);
    }

    @Override
    public List<Progress> getProgressByTaskId(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        return progressRepository.findByTask(task);
    }

    @Override
    public List<Progress> getProgressByStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return progressRepository.findByStudent(student);
    }

    @Override
    public Map<String, Object> getTaskStatistics(Long taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageProgress", progressRepository.getAverageProgressForTask(taskId));
        stats.put("averageScore", progressRepository.getAverageScoreForTask(taskId));
        stats.put("completedCount", progressRepository.countCompletedForTask(taskId));
        stats.put("totalAssignees", task.getAssignees().size());

        return stats;
    }
}