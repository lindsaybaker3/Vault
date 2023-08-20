package org.example.controllers;


import org.example.domain.Result;
import org.example.domain.ResultType;
import org.example.domain.TransactionsService;
import org.example.models.Transactions;
import org.example.domain.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.models.AppUser;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
public class TransactionsController {

    private final TransactionsService service;
    private final AppUserService appUserService;

    @Autowired
    public TransactionsController(TransactionsService service, AppUserService appUserService) {
        this.service = service;
        this.appUserService = appUserService;
    }

    @GetMapping("/transactions")
    public List<Transactions> findByUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        return service.findByUserId(appUser.getAppUserId());
    }

    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<Transactions> findByTransactionId(@PathVariable int transactionId) {
        Transactions transactions = service.findByTransactionId(transactionId);
        if (transactions == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(transactions, HttpStatus.OK);
    }

    @GetMapping("/transaction/goals/{goalsId}")
    public List<Transactions> findByGoalsId(@PathVariable int goalsId) {
        return service.findByGoalsId(goalsId);
    }

    @PostMapping("/transaction")
    public ResponseEntity<Object> create(@RequestBody Transactions transactions) {
        String username = SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString();
        AppUser appUser = (AppUser) appUserService.loadUserByUsername(username);
        transactions.setAppUserId(appUser.getAppUserId());

        Result result = service.create(transactions);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return ErrorResponse.build(result);
    }

    @PutMapping("/transaction/{transactionId}")
    public ResponseEntity<?> update(@PathVariable int transactionId, @RequestBody Transactions transactions) {
        Result<Void> result = service.update(transactions);
        if (result.isSuccess()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ErrorResponse.build(result);
    }

    @DeleteMapping("/transaction/{transactionId}")
    public ResponseEntity<Void> delete(@PathVariable int transactionId) {
        Result result = service.deleteById(transactionId);
        if (result.getResultType() == ResultType.NOT_FOUND) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}