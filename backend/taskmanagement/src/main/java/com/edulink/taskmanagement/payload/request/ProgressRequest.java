package com.edulink.taskmanagement.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ProgressRequest {
    @Min(0)
    @Max(100)
    private Integer score;
    private String feedback;
}