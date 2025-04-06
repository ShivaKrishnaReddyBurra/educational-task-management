package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    // GET users by role (existing)
    @GetMapping
    public ResponseEntity<List<User>> getUsersByRole(@RequestParam String role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    // GET current user (new for Settings)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@RequestParam Long userId) { // In a real app, use authentication
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // PUT update current user (new for Settings)
    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(
            @RequestParam Long userId, // Replace with @AuthenticationPrincipal in a real app
            @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }
}