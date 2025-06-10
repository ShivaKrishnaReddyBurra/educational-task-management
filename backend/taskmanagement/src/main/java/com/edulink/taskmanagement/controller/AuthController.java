package com.edulink.taskmanagement.controller;

import com.edulink.taskmanagement.model.User;
import com.edulink.taskmanagement.payload.request.LoginRequest;
import com.edulink.taskmanagement.payload.request.SignupRequest;
import com.edulink.taskmanagement.payload.response.MessageResponse;
import com.edulink.taskmanagement.payload.response.UserResponse;
import com.edulink.taskmanagement.repository.UserRepository;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signupRequest) {

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            logger.warn("Signup failed: Email {} already in use", signupRequest.getEmail());
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (!signupRequest.getRole().equals("STUDENT") && !signupRequest.getRole().equals("TUTOR")) {
            logger.error("Signup failed: Invalid role {}", signupRequest.getRole());
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
        logger.info("Processing signin request for email: {}", loginRequest.getEmail());
        try {
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> {
                        logger.error("Signin failed: User with email {} not found", loginRequest.getEmail());
                        return new RuntimeException("Error: User not found");
                    });

            if (!user.getPassword().equals(loginRequest.getPassword())) {
                logger.warn("Signin failed: Invalid password for email {}", loginRequest.getEmail());
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
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse(e.getMessage()));
        }
    }
}