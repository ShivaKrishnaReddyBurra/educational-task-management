package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.payload.request.TaskRequest;
import com.edulink.taskmanagement.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    @Override
    public Task createTask(TaskRequest taskRequest, Long tutorId) {
        User tutor = userService.getUsersByRole("TUTOR").stream()
            .filter(u -> u.getId().equals(tutorId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Tutor not found"));
        Task task = new Task();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDeadline(taskRequest.getDeadline());
        task.setStatus("PENDING");
        task.setSubject(taskRequest.getSubject());
        task.setMaxScore(taskRequest.getMaxScore() != null ? taskRequest.getMaxScore() : 100);
        task.setCreatedBy(tutor);
        List<User> assignees = userService.getUsersByRole("STUDENT").stream()
            .filter(u -> taskRequest.getAssigneeIds().contains(u.getId()))
            .collect(Collectors.toList());
        task.setAssignees(assignees);

        String attachmentUrl = handleFileUpload(taskRequest.getFile());
        task.setAttachmentUrl(attachmentUrl);

        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Long id, TaskRequest taskRequest, Long tutorId) {
        Task task = getTaskById(id);
        if (!task.getCreatedBy().getId().equals(tutorId)) {
            throw new RuntimeException("Only the creator can update the task");
        }
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        task.setDeadline(taskRequest.getDeadline());
        task.setSubject(taskRequest.getSubject());
        task.setMaxScore(taskRequest.getMaxScore() != null ? taskRequest.getMaxScore() : 100);
        List<User> assignees = userService.getUsersByRole("STUDENT").stream()
            .filter(u -> taskRequest.getAssigneeIds().contains(u.getId()))
            .collect(Collectors.toList());
        task.setAssignees(assignees);

        String attachmentUrl = handleFileUpload(taskRequest.getFile());
        if (attachmentUrl != null) {
            task.setAttachmentUrl(attachmentUrl);
        }

        return taskRepository.save(task);
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.delete(getTaskById(id));
    }

    @Override
    public List<Task> getTasksByTutor(Long tutorId) {
        User tutor = userService.getUsersByRole("TUTOR").stream()
            .filter(u -> u.getId().equals(tutorId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Tutor not found"));
        return taskRepository.findByCreatedBy(tutor);
    }

    @Override
    public List<Task> getTasksByStudent(Long studentId) {
        return taskRepository.findByAssigneeId(studentId);
    }

    @Override
    public List<Task> getUpcomingTasks(LocalDateTime start, LocalDateTime end) {
        return taskRepository.findByDeadlineBetween(start, end);
    }

    @Override
    public List<Task> getOverdueTasks() {
        return taskRepository.findOverdueTasks(LocalDateTime.now());
    }

    @Override
    public List<Double> getWeeklyCompletionRates(Long tutorId) {
        User tutor = userService.getUsersByRole("TUTOR").stream()
            .filter(u -> u.getId().equals(tutorId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Tutor not found"));
        List<Task> tasks = taskRepository.findByCreatedBy(tutor);
        LocalDateTime now = LocalDateTime.now();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int currentWeek = now.get(weekFields.weekOfWeekBasedYear());
        return tasks.stream()
            .filter(task -> task.getDeadline() != null && task.getDeadline().isBefore(now))
            .collect(Collectors.groupingBy(
                task -> task.getDeadline().get(weekFields.weekOfWeekBasedYear()),
                Collectors.mapping(
                    task -> task.getProgresses().stream()
                        .mapToDouble(progress -> progress.getScore() != null ? progress.getScore() : 0)
                        .average().orElse(0),
                    Collectors.averagingDouble(Double::doubleValue)
                )
            ))
            .entrySet().stream()
            .filter(entry -> entry.getKey() >= currentWeek - 6 && entry.getKey() <= currentWeek)
            .sorted(Map.Entry.comparingByKey())
            .map(Map.Entry::getValue)
            .collect(Collectors.toList());
    }

    @Override
    public List<Double> getTaskCompletionRates(Long tutorId, Long studentId, String subject, String period) {
        List<Task> tasks = filterTasks(tutorId, studentId, subject);
        LocalDateTime now = LocalDateTime.now();
        int range;
        TemporalField field;
        switch (period.toLowerCase()) {
            case "daily": range = 7; field = ChronoField.DAY_OF_YEAR; break;
            case "weekly": range = 7; field = WeekFields.of(Locale.getDefault()).weekOfWeekBasedYear(); break;
            case "monthly": range = 6; field = ChronoField.MONTH_OF_YEAR; break;
            case "yearly": range = 5; field = ChronoField.YEAR; break;
            default: throw new IllegalArgumentException("Invalid period: " + period);
        }
        Map<Integer, Double> rates = tasks.stream()
            .filter(task -> task.getDeadline() != null && task.getDeadline().isBefore(now))
            .collect(Collectors.groupingBy(
                task -> (int) task.getDeadline().getLong(field),
                Collectors.mapping(
                    task -> task.getProgresses().stream()
                        .mapToDouble(progress -> progress.getScore() != null ? progress.getScore() : 0)
                        .average().orElse(0),
                    Collectors.averagingDouble(Double::doubleValue)
                )
            ));
        List<Double> result = new ArrayList<>();
        int current = now.get(field);
        for (int i = current - range + 1; i <= current; i++) {
            result.add(rates.getOrDefault(i, 0.0));
        }
        return result;
    }

    @Override
    public Map<String, List<Double>> getSubjectPerformance(Long tutorId, Long studentId, String period) {
        List<Task> tasks = filterTasks(tutorId, studentId, null);
        LocalDateTime now = LocalDateTime.now();
        int range;
        ChronoUnit unit;
        switch (period.toLowerCase()) {
            case "daily": range = 7; unit = ChronoUnit.DAYS; break;
            case "weekly": range = 7; unit = ChronoUnit.WEEKS; break;
            case "monthly": range = 6; unit = ChronoUnit.MONTHS; break;
            case "yearly": range = 5; unit = ChronoUnit.YEARS; break;
            default: throw new IllegalArgumentException("Invalid period: " + period);
        }
        LocalDateTime start = now.minus(range, unit);
        Map<String, List<Task>> bySubject = tasks.stream()
            .filter(task -> task.getDeadline() != null && task.getDeadline().isAfter(start))
            .collect(Collectors.groupingBy(Task::getSubject));
        Map<String, List<Double>> performance = new HashMap<>();
        for (String subj : bySubject.keySet()) {
            List<Double> scores = bySubject.get(subj).stream()
                .map(task -> task.getProgresses().stream()
                    .mapToDouble(progress -> progress.getScore() != null ? progress.getScore() : 0)
                    .average().orElse(0))
                .collect(Collectors.toList());
            performance.put(subj, scores);
        }
        return performance;
    }

    @Override
    public Map<String, Double> getGradeDistribution(Long tutorId, Long studentId, String subject) {
        List<Task> tasks = filterTasks(tutorId, studentId, subject);
        Map<String, Long> gradeCount = tasks.stream()
            .flatMap(task -> task.getProgresses().stream())
            .map(progress -> {
                Integer score = progress.getScore();
                if (score == null) return "F";
                if (score >= 90) return "A";
                if (score >= 80) return "B";
                if (score >= 70) return "C";
                if (score >= 60) return "D";
                return "F";
            })
            .collect(Collectors.groupingBy(grade -> grade, Collectors.counting()));
        long total = gradeCount.values().stream().mapToLong(Long::longValue).sum();
        Map<String, Double> distribution = new HashMap<>();
        distribution.put("A", gradeCount.getOrDefault("A", 0L) * 100.0 / total);
        distribution.put("B", gradeCount.getOrDefault("B", 0L) * 100.0 / total);
        distribution.put("C", gradeCount.getOrDefault("C", 0L) * 100.0 / total);
        distribution.put("D & F", (gradeCount.getOrDefault("D", 0L) + gradeCount.getOrDefault("F", 0L)) * 100.0 / total);
        return distribution;
    }

    @Override
    public Map<String, Double> getSubmissionTimeline(Long tutorId, Long studentId, String subject) {
        List<Task> tasks = filterTasks(tutorId, studentId, subject);
        Map<String, Long> timelineCount = tasks.stream()
            .flatMap(task -> task.getProgresses().stream())
            .map(progress -> {
                LocalDateTime deadline = progress.getTask().getDeadline();
                LocalDateTime submitted = progress.getSubmittedAt() != null ? progress.getSubmittedAt() : LocalDateTime.now();
                if (submitted.isBefore(deadline.minusDays(1))) return "Early";
                if (submitted.isBefore(deadline)) return "On-time";
                if (submitted.isBefore(deadline.plusDays(1))) return "Late";
                if (submitted.isAfter(deadline)) return "After deadline";
                return "Incomplete";
            })
            .collect(Collectors.groupingBy(status -> status, Collectors.counting()));
        long total = timelineCount.values().stream().mapToLong(Long::longValue).sum();
        Map<String, Double> timeline = new HashMap<>();
        timeline.put("Early", timelineCount.getOrDefault("Early", 0L) * 100.0 / total);
        timeline.put("On-time", timelineCount.getOrDefault("On-time", 0L) * 100.0 / total);
        timeline.put("Late", timelineCount.getOrDefault("Late", 0L) * 100.0 / total);
        timeline.put("After deadline", timelineCount.getOrDefault("After deadline", 0L) * 100.0 / total);
        timeline.put("Incomplete", timelineCount.getOrDefault("Incomplete", 0L) * 100.0 / total);
        return timeline;
    }

    @Override
    public List<Task> getTasksForMonth(Long userId, String role, int year, int month) {
        LocalDateTime start = LocalDateTime.of(year, month, 1, 0, 0);
        LocalDateTime end = start.plusMonths(1).minusSeconds(1);
        List<Task> tasks;
        if ("TUTOR".equalsIgnoreCase(role)) {
            User tutor = userService.getUsersByRole("TUTOR").stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
            tasks = taskRepository.findByCreatedBy(tutor);
        } else if ("STUDENT".equalsIgnoreCase(role)) {
            tasks = taskRepository.findByAssigneeId(userId);
        } else {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return tasks.stream()
            .filter(task -> task.getDeadline() != null &&
                !task.getDeadline().isBefore(start) &&
                !task.getDeadline().isAfter(end))
            .collect(Collectors.toList());
    }

    @Override
    public List<Task> getUpcomingEvents(Long userId, String role, LocalDateTime from) {
        LocalDateTime to = from.plusDays(30);
        List<Task> tasks;
        if ("TUTOR".equalsIgnoreCase(role)) {
            User tutor = userService.getUsersByRole("TUTOR").stream()
                .filter(u -> u.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
            tasks = taskRepository.findByCreatedBy(tutor);
        } else if ("STUDENT".equalsIgnoreCase(role)) {
            tasks = taskRepository.findByAssigneeId(userId);
        } else {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return tasks.stream()
            .filter(task -> task.getDeadline() != null &&
                !task.getDeadline().isBefore(from) &&
                !task.getDeadline().isAfter(to))
            .sorted(Comparator.comparing(Task::getDeadline))
            .collect(Collectors.toList());
    }

    private List<Task> filterTasks(Long tutorId, Long studentId, String subject) {
        User tutor = userService.getUsersByRole("TUTOR").stream()
            .filter(u -> u.getId().equals(tutorId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Tutor not found"));
        List<Task> tasks = taskRepository.findByCreatedBy(tutor);
        if (studentId != null) {
            tasks = tasks.stream()
                .filter(task -> task.getAssignees().stream().anyMatch(u -> u.getId().equals(studentId)))
                .collect(Collectors.toList());
        }
        if (subject != null && !subject.equalsIgnoreCase("all-subjects")) {
            tasks = tasks.stream()
                .filter(task -> subject.equalsIgnoreCase(task.getSubject()))
                .collect(Collectors.toList());
        }
        return tasks;
    }

    private String handleFileUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        long maxSize = 10 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size exceeds 10MB limit");
        }

        String contentType = file.getContentType();
        if (!isValidFileType(contentType)) {
            throw new RuntimeException("Invalid file type. Only PDF, DOC, DOCX, and TXT are allowed.");
        }

        try {
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.write(filePath, file.getBytes());
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
    }

    private boolean isValidFileType(String contentType) {
        return contentType != null && (
                contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                contentType.equals("text/plain")
        );
    }
}