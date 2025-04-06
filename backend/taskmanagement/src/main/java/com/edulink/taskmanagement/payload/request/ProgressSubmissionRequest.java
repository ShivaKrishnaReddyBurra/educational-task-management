package com.edulink.taskmanagement.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProgressSubmissionRequest {
    @NotNull
    private Long taskId;
    @Min(0)
    @Max(100)
    private Integer percentageComplete;
    private String comment;
    private String submissionUrl;
}