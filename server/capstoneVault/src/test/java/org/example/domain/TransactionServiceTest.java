package org.example.domain;

import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Transaction;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class TransactionServiceTest {

    @Autowired
    TransactionService service;

    @MockBean
    TransactionsJdbcTemplateRepository repository;


    @Test
    void ShouldFindListOfTransaction() {
        when(repository.findByUserId(1)).thenReturn(List.of(
                new Transaction(1, 1, 1, "groceries", new BigDecimal("100"),
                        LocalDate.of(2023, 8, 15)),
                new Transaction(2, 1, 1, "groceries", new BigDecimal("200"),
                        LocalDate.of(2023, 8, 16))
        ));

        List<Transaction> transactions = service.findByUserId(1);

        assertEquals(2, transactions.size());
    }

    @Test
    void shouldFindByTransactionId() {
        when(repository.findByTransactionId(3)).thenReturn(
                new Transaction(3, 1, 1, "rent", new BigDecimal("1000"),
                        LocalDate.of(2023, 8, 15))
        );
        Transaction transaction = service.findByTransactionId(3);
        assertNotNull(transaction);
    }

    @Test
    void shouldFindListOfByGoalsId() {
        when(repository.findByGoalsId(1)).thenReturn(List.of(
                new Transaction(1, 1, 1, "groceries", new BigDecimal("100"),
                        LocalDate.of(2023, 8, 15)),
                new Transaction(2, 1, 1, "groceries", new BigDecimal("200"),
                        LocalDate.of(2023, 8, 16))
        ));

        List<Transaction> transactions = service.findByGoalsId(1);

        assertEquals(2, transactions.size());
    }


    @Test
    void shouldCreateTransaction() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("Purchase");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.create(transaction);

        assertTrue(result.isSuccess());
        assertTrue(result.getErrorMessages().isEmpty());

        verify(repository).create(transaction);
    }



    @Test
    void shouldNotCreateNull() {
        Transaction transaction = null;

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertEquals(1, result.getErrorMessages().size());
        assertTrue(result.getErrorMessages().contains("Transaction cannot be null."));
    }


    @Test
    void shouldNotCreateWithNullDate() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("Purchase");
        transaction.setAmount(new BigDecimal("50"));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date is required."));
    }


    @Test
    void shouldNotCreateWithNoDateInTheFuture() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 29));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date needs to be a past date."));
    }


    @Test
    void shouldNotCreateNullAmount() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(null);
        transaction.setTransactionDate(LocalDate.of(2023, 8, 10));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }


    @Test
    void shouldNotCreateWithNegativeAmount() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("-50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }

    @Test
    void shouldNotCreateWithNoDescription() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction description is required."));
    }


    @Test
    void shouldNotCreateWithNoGoal() {
        Transaction transaction = new Transaction();
        transaction.setAppUserId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Goal is required."));
    }


    @Test
    void shouldUpdateTransaction() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("Purchase");
        transaction.setAmount(new BigDecimal("100"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        when(repository.update(any(Transaction.class))).thenReturn(true);

        Result result = service.update(transaction);

        assertTrue(result.isSuccess());
        assertTrue(result.getErrorMessages().isEmpty());
        verify(repository).update(transaction);
    }


    @Test
    void shouldNotUpdateWithNullDate() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("Purchase");
        transaction.setAmount(new BigDecimal("50"));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date is required."));
    }


    @Test
    void shouldNotUpdateWithNoDateInTheFuture() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date needs to be a past date."));
    }


    @Test
    void shouldNotUpdateNullAmount() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(null);
        transaction.setTransactionDate(LocalDate.of(2023, 8, 10));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }


    @Test
    void shouldNotUpdateWithNegativeAmount() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("-50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 12));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }

    @Test
    void shouldNotUpdateWithNoDescription() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setGoalsId(1);
        transaction.setDescription("");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction description is required."));
    }


    @Test
    void shouldNotUpdateWithNoGoal() {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(1);
        transaction.setAppUserId(1);
        transaction.setDescription("theater");
        transaction.setAmount(new BigDecimal("50"));
        transaction.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.update(transaction);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Goal is required."));
    }


    @Test
    void shouldNotDeleteNonExistentTransaction() {
        int transactionId = 1000;
        Result result = service.deleteById(transactionId);

        assertFalse(result.isSuccess());
        assertEquals(1, result.getErrorMessages().size());
        assertEquals("Transaction id " + transactionId + " was not found.", result.getErrorMessages().get(0));
    }

    @Test
    void shouldDelete() {
     when(repository.deleteById(1)).thenReturn(true);
     Result result = service.deleteById(1);
        assertTrue(result.isSuccess());
    }
}