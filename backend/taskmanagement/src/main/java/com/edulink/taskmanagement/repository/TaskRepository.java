package com.edulink.taskmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.edulink.taskmanagement.model.Task;
import com.edulink.taskmanagement.model.User;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByCreatedBy(User user);

    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a.id = :userId")
    List<Task> findByAssigneeId(@Param("userId") Long userId);

    List<Task> findByDeadlineBefore(LocalDateTime date);

    @Query("SELECT t FROM Task t WHERE t.deadline BETWEEN :start AND :end")
    List<Task> findByDeadlineBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT t FROM Task t WHERE t.deadline < :now AND t.status = 'PENDING'")
    List<Task> findOverdueTasks(@Param("now") LocalDateTime now);

    
}