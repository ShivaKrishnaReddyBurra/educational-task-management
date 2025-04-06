package com.edulink.taskmanagement.service;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.payload.request.ProgressRequest;
import com.edulink.taskmanagement.payload.request.ProgressSubmissionRequest;

import java.util.List;
import java.util.Map;

public interface ProgressService {
    Progress submitProgress(ProgressSubmissionRequest submissionRequest, Long studentId);
    Progress gradeSubmission(Long progressId, ProgressRequest progressRequest, Long tutorId);
    List<Progress> getProgressByTaskId(Long taskId);
    List<Progress> getProgressByStudent(Long studentId);
    Map<String, Object> getTaskStatistics(Long taskId);
}