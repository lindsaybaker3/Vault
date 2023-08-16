package org.example.controllers;


import org.example.domain.Result;
import org.example.domain.ResultType;
import org.example.domain.TransactionService;
import org.example.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
@CrossOrigin
public class TransactionController {

    private final TransactionService service;

    @Autowired
    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping("/transaction/user/{appUserId}")
    public List<Transaction> findByUserId(@PathVariable int appUserId) {
        return service.findByUserId(appUserId);
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Transaction> findByTransactionId(@PathVariable int transactionId) {
        Transaction transaction = service.findByTransactionId(transactionId);
        if (transaction == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transaction, HttpStatus.OK);
    }

    @GetMapping("/goals/{goalsId}")
    public List<Transaction> findByGoalsId(@PathVariable int goalsId) {
        return service.findByGoalsId(goalsId);
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody Transaction transaction) {
        Result<Void> result = service.create(transaction);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/{transactionId}")
    public ResponseEntity<?> update(@PathVariable int transactionId, @RequestBody Transaction transaction) {
        Result<Void> result = service.update(transaction);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> delete(@PathVariable int transactionId) {
        Result result = service.deleteById(transactionId);
        if (result.getResultType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}