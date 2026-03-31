package com.todo.list.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.todo.list.entity.Task;
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    boolean existsByTitleIgnoreCase(String title);
}
