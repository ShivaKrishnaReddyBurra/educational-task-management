package com.edulink.taskmanagement.payload.request;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public class TaskRequest {
    private String title;
    private String description;
    private LocalDateTime deadline;
    private String subject;
    private List<Long> assigneeIds;
    private Integer maxScore; // Added
    private MultipartFile file;

    public TaskRequest() {}

    public TaskRequest(String title, String description, LocalDateTime deadline, String subject, List<Long> assigneeIds, Integer maxScore, MultipartFile file) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.subject = subject;
        this.assigneeIds = assigneeIds;
        this.maxScore = maxScore;
        this.file = file;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public List<Long> getAssigneeIds() { return assigneeIds; }
    public void setAssigneeIds(List<Long> assigneeIds) { this.assigneeIds = assigneeIds; }
    public Integer getMaxScore() { return maxScore; }
    public void setMaxScore(Integer maxScore) { this.maxScore = maxScore; }
    public MultipartFile getFile() { return file; }
    public void setFile(MultipartFile file) { this.file = file; }
}