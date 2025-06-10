package com.edulink.taskmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String name;
    private String role;

    private String grade; // e.g., "A", "B+", "N/A"
    private String status; // e.g., "COMPLETED", "IN_PROGRESS", "PENDING"
    private LocalDateTime lastActive; // Timestamp of last activity

    @Column(columnDefinition = "TEXT") // Added for notification preferences
    private String preferences; // e.g., {"emailNotifications": true, "taskReminders": true}

    @OneToMany(mappedBy = "createdBy")
    @JsonBackReference
    private List<Task> createdTasks = new ArrayList<>();

    @ManyToMany(mappedBy = "assignees")
    @JsonBackReference
    private List<Task> assignedTasks = new ArrayList<>();

    // Default constructor with initial values
    public User() {
        this.grade = "N/A";
        this.status = "PENDING";
        this.lastActive = LocalDateTime.now();
        this.preferences = "{\"emailNotifications\": true, \"taskReminders\": true}"; // Default preferences
    }
}