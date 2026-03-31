package com.todo.list.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.todo.list.entity.Task;
import com.todo.list.exception.TaskException;
import com.todo.list.repository.TaskRepository;

import jakarta.transaction.Transactional;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    public Task createTask(Task task){
        if (taskRepository.existsByTitleIgnoreCase(task.getTitle())) {
            throw new TaskException("Task with title '" + task.getTitle() + "' already exists.");
        }
        return taskRepository.save(task);
    }

    public Task getTaskById(Long id){
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskException("Task not found with id: " + id));
    }

    @Transactional
    public Task updateTask(Long id, Task task){
        Task existingTask = getTaskById(id);
        
        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setPriority(task.getPriority());
        
        return taskRepository.save(existingTask);
    }

    public void deleteTask(Long id){
        Task existingTask = getTaskById(id);
        taskRepository.delete(existingTask);
    }
}
