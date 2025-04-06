package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.repository.TaskRepository;
import com.edulink.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.IsoFields;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService { // Assuming an interface exists
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Override
    public List<User> getUsersByRole(String role) {
        List<User> users = userRepository.findAll().stream()
            .filter(user -> user.getRole().equalsIgnoreCase(role))
            .toList();
        if ("STUDENT".equalsIgnoreCase(role)) {
            users.forEach(this::updateStudentDetails);
        }
        return users;
    }

    @Override
    public List<Double> getStudentProgressOverTime(Long tutorId) {
        List<Task> tasks = taskRepository.findByCreatedBy(
            userRepository.findById(tutorId)
                .filter(u -> u.getRole().equalsIgnoreCase("TUTOR"))
                .orElseThrow(() -> new RuntimeException("Tutor not found"))
        );
        LocalDateTime now = LocalDateTime.now();
        int currentWeek = now.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);

        Map<Integer, Double> weeklyProgress = tasks.stream()
            .flatMap(task -> task.getProgresses().stream())
            .filter(progress -> progress.getStudent() != null)
            .collect(Collectors.groupingBy(
                progress -> progress.getTask().getDeadline().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR),
                Collectors.averagingDouble(Progress::getPercentageComplete)
            ));

        return weeklyProgress.entrySet().stream()
            .filter(entry -> entry.getKey() >= currentWeek - 13 && entry.getKey() <= currentWeek)
            .sorted(Map.Entry.comparingByKey())
            .map(Map.Entry::getValue)
            .collect(Collectors.toList());
    }

    private void updateStudentDetails(User student) {
        List<Task> tasks = taskRepository.findByAssigneeId(student.getId());
        if (tasks.isEmpty()) {
            student.setGrade("N/A");
            student.setStatus("PENDING");
        } else {
            double completionPercentage = tasks.stream()
                .flatMap(task -> task.getProgresses().stream())
                .filter(p -> p.getStudent().getId().equals(student.getId()))
                .mapToDouble(Progress::getPercentageComplete)
                .average()
                .orElse(0);

            student.setGrade(calculateGrade(completionPercentage));
            student.setStatus(calculateStatus(tasks));
        }
        student.setLastActive(LocalDateTime.now());
        userRepository.save(student);
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) return "A";
        if (percentage >= 80) return "B";
        if (percentage >= 70) return "C";
        if (percentage >= 60) return "D";
        return "F";
    }

    private String calculateStatus(List<Task> tasks) {
        if (tasks.isEmpty()) return "PENDING";
        if (tasks.stream().allMatch(t -> "COMPLETED".equalsIgnoreCase(t.getStatus()))) {
            return "COMPLETED";
        } else if (tasks.stream().anyMatch(t -> "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))) {
            return "IN_PROGRESS";
        } else {
            return "PENDING";
        }
    }

    // New methods for Settings
    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    @Override
    public User updateUser(Long userId, User updatedUser) {
        User existingUser = getUserById(userId);
        if (updatedUser.getName() != null) existingUser.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) existingUser.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null) existingUser.setPassword(updatedUser.getPassword()); // Should be hashed in a real app
        if (updatedUser.getPreferences() != null) existingUser.setPreferences(updatedUser.getPreferences());
        return userRepository.save(existingUser);
    }
}