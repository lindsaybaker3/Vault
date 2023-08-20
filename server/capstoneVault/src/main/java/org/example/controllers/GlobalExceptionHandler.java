package org.example.controllers;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Collections;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException exception){
        exception.printStackTrace();
        return new ResponseEntity<>(List.of("Something went wrong on our database. Unfortunately , Your request fail. :/ "), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler({Exception.class, RuntimeException.class})
    public ResponseEntity<Object> handleOtherExceptions(Exception exception) {
        exception.printStackTrace();
        return new ResponseEntity<>(Collections.singletonList("Sorry, an error occurred on our end :/"), HttpStatus.INTERNAL_SERVER_ERROR);
    }


}