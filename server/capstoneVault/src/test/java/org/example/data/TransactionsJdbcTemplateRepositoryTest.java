package org.example.data;

import org.example.models.Transaction;
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
        List<Transaction> result = repository.findByUserId(appUserId);
        assertTrue(result.size() >= 1);
    }

    @Test
    void shouldNotFindByUserId() {
        int appUserId = 1000;
        List<Transaction> result = repository.findByUserId(appUserId);
        assertTrue(result.isEmpty());
    }

    @Test
    void shouldFindByTransactionId() {
        int transactionId = 1;
        Transaction transaction = repository.findByTransactionId(transactionId);
        assertNotNull(transaction);
    }

    @Test
    void shouldNotFindByTransactionId() {
        int transactionId = 1000;
        Transaction transaction = repository.findByTransactionId(transactionId);
        assertNull(transaction);
    }

    @Test
    void shouldFindByGoalsId() {
        int goalsId = 1;
        List<Transaction> result = repository.findByGoalsId(goalsId);
        assertTrue(result.size() >= 1);
    }

    @Test
    void shouldNotFindByGoalsId() {
        int goalsId = 1000;
        List<Transaction> result = repository.findByGoalsId(goalsId);
        assertTrue(result.isEmpty());
    }


    @Test
    void testCreate() {
        Transaction transaction = new Transaction();

        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("Groceries");
        transaction.setAmount(new BigDecimal("150"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));
        Transaction result = repository.create(transaction);

        assertNotNull(result);
        assertNotNull(result.getTransactionId());

        Transaction retrievedTransaction = repository.findByTransactionId(result.getTransactionId());
        assertEquals(result, retrievedTransaction);
    }


    @Test
    void shouldUpdate() {
        Transaction transaction = new Transaction();

        transaction.setTransactionId(2);
        transaction.setGoalsId(1);
        transaction.setDescription("Rent");
        transaction.setAmount(new BigDecimal("1800"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        assertTrue(repository.update(transaction));

        Transaction updatedTransaction = repository.findByTransactionId(2);

        assertNotNull(updatedTransaction);
        assertEquals(transaction.getGoalsId(), updatedTransaction.getGoalsId());
        assertEquals(transaction.getDescription(), updatedTransaction.getDescription());
        assertEquals(transaction.getAmount(), updatedTransaction.getAmount());
        assertEquals(transaction.getTransactionDate(), updatedTransaction.getTransactionDate());
    }


    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(3));
    }

}