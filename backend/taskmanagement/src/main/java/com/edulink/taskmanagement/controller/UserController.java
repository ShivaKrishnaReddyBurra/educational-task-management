package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam String role) {
        logger.info("Fetching users with role: {}", role);
        try {
            List<User> users = userService.getUsersByRole(role);
            logger.debug("Users retrieved for role {}: {}", role, users.size());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching users for role: {}", role, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam Long userId) {
        logger.info("Fetching current user with userId: {}", userId);
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error fetching current user with userId: {}", userId, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @RequestParam Long userId,
            @RequestBody User updatedUser) {
        logger.info("Updating user with userId: {}", userId);
        try {
            User user = userService.updateUser(userId, updatedUser);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            logger.error("Error updating user with userId: {}", userId, e);
            return ResponseEntity.badRequest().build();
        }
    }
}