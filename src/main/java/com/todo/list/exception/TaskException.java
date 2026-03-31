package com.todo.list.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception for Task-related business logic failures.
 * The @ResponseStatus annotation ensures that if this is thrown
 * without a Global Exception Handler, it defaults to a 404.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskException extends RuntimeException {

    public TaskException(String message) {
        super(message);
    }
}