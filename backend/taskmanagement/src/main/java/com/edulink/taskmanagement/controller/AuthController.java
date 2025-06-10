package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.payload.request.LoginRequest;
import com.edulink.taskmanagement.payload.request.SignupRequest;
import com.edulink.taskmanagement.payload.response.MessageResponse;
import com.edulink.taskmanagement.payload.response.UserResponse;
import com.edulink.taskmanagement.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (!signupRequest.getRole().equals("STUDENT") && !signupRequest.getRole().equals("TUTOR")) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Role must be STUDENT or TUTOR"));
        }

        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(signupRequest.getPassword()); // Plain text for simplicity
        user.setName(signupRequest.getName());
        user.setRole(signupRequest.getRole());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Error: User not found"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid password"));
        }

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole()
        );

        return ResponseEntity.ok(userResponse);
    }
}