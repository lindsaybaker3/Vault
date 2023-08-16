package org.example.controllers;

import org.example.domain.TransactionService;
import org.example.models.Transaction;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultMatcher;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class TransactionControllerTest {

    @MockBean
    TransactionService service;

    @Autowired
    MockMvc mvc;

//    private int transactionId;
//    private int appUserId;
//    private int  goalsId;
//    private String description;
//    private BigDecimal amount;
//    private LocalDate transactionDate;



    @Test
    void findByUserIdShouldReturn200() throws Exception {
        int appUserId = 1;

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(new Transaction(1, 1,1, "Rent", new BigDecimal("1500"), LocalDate.of(2023, 8, 15)));
        transactions.add(new Transaction(1, 1,1, "Groceries", new BigDecimal("100"), LocalDate.of(2023, 8, 16)));

        when(service.findByUserId(appUserId)).thenReturn(transactions);



        mvc.perform(get("/api/vault/transaction/user/1"))
     .andExpect(status().isOk())
     .andExpect((ResultMatcher) content().contentType("application/json"));
        assertEquals(transactions.size(), 2);
    }


    @Test
    void findByTransactionId() {
    }

    @Test
    void findByGoalsId() {
    }

    @Test
    void create() {
    }

    @Test
    void update() {
    }

    @Test
    void delete() {
    }
}