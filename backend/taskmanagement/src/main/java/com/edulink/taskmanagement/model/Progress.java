package com.edulink.taskmanagement.model;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.Data;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "progress")
@Data
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    @JsonManagedReference
    private Task task;

    @ManyToOne
    @JoinColumn(name = "student_id")
    @JsonManagedReference
    private User student;

    private int percentageComplete;
    private String comment;
    private String submissionUrl;
    private LocalDateTime submittedAt;
    private Integer score;
}