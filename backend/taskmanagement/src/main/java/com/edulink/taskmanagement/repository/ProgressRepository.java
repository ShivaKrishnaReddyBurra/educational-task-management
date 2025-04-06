package com.edulink.taskmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edulink.taskmanagement.model.Progress;
import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.model.User;

import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByStudent(User student);
    List<Progress> findByTask(Task task);

    @Query("SELECT AVG(p.percentageComplete) FROM Progress p WHERE p.task.id = :taskId")
    Double getAverageProgressForTask(@Param("taskId") Long taskId);

    @Query("SELECT AVG(p.score) FROM Progress p WHERE p.task.id = :taskId AND p.score IS NOT NULL")
    Double getAverageScoreForTask(@Param("taskId") Long taskId);

    @Query("SELECT COUNT(p) FROM Progress p WHERE p.task.id = :taskId AND p.percentageComplete = 100")
    Integer countCompletedForTask(@Param("taskId") Long taskId);
}