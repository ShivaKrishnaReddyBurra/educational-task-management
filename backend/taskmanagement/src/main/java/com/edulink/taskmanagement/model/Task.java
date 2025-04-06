package com.edulink.taskmanagement.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
@Entity
@Table(name = "tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime deadline;
    private String status; // e.g., "PENDING", "IN_PROGRESS", "COMPLETED"
    private String subject;
    private Integer maxScore;
    private String attachmentUrl;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    @JsonManagedReference 
    private User createdBy;

    @ManyToMany
    @JoinTable(
        name = "task_assignees",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonManagedReference 
    private List<User> assignees = new ArrayList<>();

    @OneToMany(mappedBy = "task")
    @JsonBackReference
    private List<Progress> progresses = new ArrayList<>();
}