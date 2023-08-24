package org.example.data;

import org.example.models.Transactions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TransactionsJdbcTemplateRepositoryTest {


    @Autowired
    TransactionsJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }


    @Test
    void shouldFindByUserId() {
        int appUserId = 1;
        List<Transactions> result = repository.findByUserId(appUserId);
        assertTrue(result.size() >= 1);
    }

    @Test
    void shouldNotFindByUserId() {
        int appUserId = 1000;
        List<Transactions> result = repository.findByUserId(appUserId);
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindByTransactionId() {
        int transactionId = 1;
        Transactions transactions = repository.findByTransactionId(transactionId);
        assertNotNull(transactions);
    }

    @Test
    void shouldNotFindByTransactionId() {
        int transactionId = 1000;
        Transactions transactions = repository.findByTransactionId(transactionId);
        assertNull(transactions);
    }

    @Test
    void shouldFindByGoalsId() {
        int goalsId = 1;
        List<Transactions> result = repository.findByGoalsId(goalsId);
        assertTrue(result.size() >= 1);
    }

    @Test
    void shouldNotFindByGoalsId() {
        int goalsId = 1000;
        List<Transactions> result = repository.findByGoalsId(goalsId);
        assertTrue(result.isEmpty());
    }


    @Test
    void shouldCreate() {
        Transactions transactions = new Transactions();

        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setGoalType("spending");
        transactions.setDescription("Groceries");
        transactions.setAmount(new BigDecimal("150"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));
        Transactions result = repository.create(transactions);

        assertNotNull(result);
        assertNotNull(result.getTransactionId());
    }


    @Test
    void shouldUpdate() {
        Transactions transactions = new Transactions();

        transactions.setTransactionId(2);
        transactions.setGoalsId(1);
        transactions.setGoalType("spending");
        transactions.setDescription("Rent");
        transactions.setAmount(new BigDecimal("1800"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));

        assertTrue(repository.update(transactions));

        Transactions updatedTransactions = repository.findByTransactionId(2);

        assertNotNull(updatedTransactions);
        assertEquals(transactions.getGoalsId(), updatedTransactions.getGoalsId());
        assertEquals(transactions.getDescription(), updatedTransactions.getDescription());
        assertEquals(transactions.getAmount(), updatedTransactions.getAmount());
        assertEquals(transactions.getTransactionDate(), updatedTransactions.getTransactionDate());
    }


    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(3));
    }

}