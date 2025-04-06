package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.User;

import java.util.List;

public interface UserService {
    List<User> getUsersByRole(String role);
    List<Double> getStudentProgressOverTime(Long tutorId);
    User getUserById(Long userId);
    User updateUser(Long userId, User updatedUser);
}