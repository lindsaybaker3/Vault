package org.example.domain;

import org.example.data.GoalsJdbcTemplateRepository;
import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Goals;
import org.example.models.Transactions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
class TransactionsServiceTest {

    @Autowired
    TransactionsService service;

    @MockBean
    TransactionsJdbcTemplateRepository repository;

    @MockBean
    GoalsJdbcTemplateRepository goalsJdbcTemplateRepository;

    @Test
    void ShouldFindListOfTransaction() {
        when(repository.findByUserId(1)).thenReturn(List.of(
                new Transactions(1, 1, 1,"saving", "travel",  "travel iceland", new BigDecimal("100"),
                        LocalDate.of(2023, 8, 15)),
                new Transactions(2, 1, 1, "saving", "grocery montly","groceries", new BigDecimal("200"),
                        LocalDate.of(2023, 8, 16))
        ));

        List<Transactions> transactions = service.findByUserId(1);

        assertEquals(2, transactions.size());
    }

    @Test
    void shouldFindByTransactionId() {
        when(repository.findByTransactionId(3)).thenReturn(
                new Transactions(3, 1, 1,"expense", "rent", "rent montly", new BigDecimal("1000"),
                        LocalDate.of(2023, 8, 15))
        );
        Transactions transactions = service.findByTransactionId(3);
        assertNotNull(transactions);
    }

    @Test
    void shouldFindListOfByGoalsId() {
        when(repository.findByGoalsId(1)).thenReturn(List.of(
                new Transactions(1, 1, 1,"saving", "groceries", "groceries", new BigDecimal("100"),
                        LocalDate.of(2023, 8, 15)),
                new Transactions(1, 1, 1,"saving", "hospital", "hospital expenses", new BigDecimal("100"),
                        LocalDate.of(2023, 8, 15))
        ));

        List<Transactions> transactions = service.findByGoalsId(1);

        assertEquals(2, transactions.size());
    }


    @Test
    void shouldCreateTransaction() {
        Goals goal = new Goals();
        goal.setGoalsId(1);
        goal.setAppUserId(123);
        goal.setCategoryId(456);
        goal.setType("spending");
        goal.setAmount(new BigDecimal("1000.00"));
        goal.setStartDate(LocalDate.of(2023, 1, 1));
        goal.setEndDate(LocalDate.of(2023, 12, 31));
        goal.setCategoryName("Shopping");


        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("Purchase");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));


        when(goalsJdbcTemplateRepository.findById(transactions.getGoalsId())).thenReturn(goal);

        Result result = service.create(transactions);

        assertTrue(result.isSuccess());
        assertTrue(result.getErrorMessages().isEmpty());

        verify(repository).create(transactions);
    }


    @Test
    void shouldNotCreateNull() {
        Transactions transactions = null;

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertEquals(1, result.getErrorMessages().size());
        assertTrue(result.getErrorMessages().contains("Transaction cannot be null."));
    }

    @Test
    void shouldNotCreateWithNullDate() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("Purchase");
        transactions.setAmount(new BigDecimal("50"));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date is required."));
    }


    @Test
    void shouldNotCreateWithNoDateInTheFuture() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 29));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date needs to be a past date."));
    }


    @Test
    void shouldNotCreateNullAmount() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(null);
        transactions.setTransactionDate(LocalDate.of(2023, 8, 10));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }


    @Test
    void shouldNotCreateWithNegativeAmount() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(new BigDecimal("-50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }

    @Test
    void shouldNotCreateWithNoDescription() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction description is required."));
    }

    @Test
    void shouldNotCreateWithNoGoal() {
        Transactions transactions = new Transactions();
        transactions.setAppUserId(1);
        transactions.setDescription("theater");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.create(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Goal not found for given ID."));
    }


    @Test
    void shouldNotCreateWithNullGoal() {
        Transactions transaction = new Transactions();
        transaction.setAppUserId(123);
        transaction.setGoalType("spending");
        transaction.setCategory("grocery");
        transaction.setDescription("Monthly grocery");
        transaction.setAmount(new BigDecimal("1000.00"));
        transaction.setTransactionDate(LocalDate.of(2022, 6, 15));


        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertEquals("Goal not found for given ID.", result.getErrorMessages().get(0));
        assertEquals(ResultType.INVALID, result.getResultType());
    }


    @Test
    void shouldNotCreateWithDateOutGoalRange() {
        Goals goal = new Goals();
        goal.setGoalsId(1);
        goal.setStartDate(LocalDate.of(2023, 1, 1));
        goal.setEndDate(LocalDate.of(2023, 12, 31));
        goal.setTransactionsList(new ArrayList<>()); // Initialize the transactions list

        Transactions transaction = new Transactions();
        transaction.setAppUserId(123);
        transaction.setGoalsId(1);
        transaction.setGoalType("spending");
        transaction.setCategory("grocery");
        transaction.setDescription("Monthly grocery");
        transaction.setAmount(new BigDecimal("1000.00"));
        transaction.setTransactionDate(LocalDate.of(2022, 6, 15));


        goal.getTransactionsList().add(transaction);

        when(goalsJdbcTemplateRepository.findById(transaction.getGoalsId())).thenReturn(goal);

        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().get(0), "Transaction date is outside the goal range");

    }


    @Test
    void shouldUpdateTransaction() {
        Goals goal = new Goals();
        goal.setGoalsId(1);
        goal.setAppUserId(123);
        goal.setCategoryId(456);
        goal.setType("spending");
        goal.setAmount(new BigDecimal("1000.00"));
        goal.setStartDate(LocalDate.of(2023, 1, 1));
        goal.setEndDate(LocalDate.of(2023, 12, 31));
        goal.setCategoryName("Shopping");


        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("Purchase");
        transactions.setAmount(new BigDecimal("100"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));

        when(goalsJdbcTemplateRepository.findById(transactions.getGoalsId())).thenReturn(goal);
        when(repository.update(any(Transactions.class))).thenReturn(true);

        Result result = service.update(transactions);

        assertTrue(result.isSuccess());
        assertTrue(result.getErrorMessages().isEmpty());
        verify(repository).update(transactions);
    }


    @Test
    void shouldNotUpdateWithNullDate() {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("Purchase");
        transactions.setAmount(new BigDecimal("50"));

        Result result = service.update(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date is required."));
    }


    @Test
    void shouldNotUpdateWithNoDateInTheFuture() {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 27));

        Result result = service.update(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction date needs to be a past date."));
    }


    @Test
    void shouldNotUpdateNullAmount() {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(null);
        transactions.setTransactionDate(LocalDate.of(2023, 8, 10));

        Result result = service.update(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }


    @Test
    void shouldNotUpdateWithNegativeAmount() {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("theater");
        transactions.setAmount(new BigDecimal("-50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 12));

        Result result = service.update(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction amount is required and needs to be bigger than zero"));
    }

    @Test
    void shouldNotUpdateWithNoDescription() {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(1);
        transactions.setAppUserId(1);
        transactions.setGoalsId(1);
        transactions.setDescription("");
        transactions.setAmount(new BigDecimal("50"));
        transactions.setTransactionDate(LocalDate.of(2023, 8, 15));

        Result result = service.update(transactions);

        assertFalse(result.isSuccess());
        assertTrue(result.getErrorMessages().contains("Transaction description is required."));
    }

    @Test
    void shouldNotUpdateWithDateOutGoalRange() {
        Goals goal = new Goals();
        goal.setGoalsId(1);
        goal.setStartDate(LocalDate.of(2023, 1, 1));
        goal.setEndDate(LocalDate.of(2023, 12, 31));
        goal.setTransactionsList(new ArrayList<>());

        Transactions transaction = new Transactions();
        transaction.setTransactionId(1);
        transaction.setAppUserId(123);
        transaction.setGoalsId(1);
        transaction.setGoalType("spending");
        transaction.setCategory("grocery");
        transaction.setDescription("Monthly grocery");
        transaction.setAmount(new BigDecimal("1000.00"));
        transaction.setTransactionDate(LocalDate.of(2022, 6, 15));


        goal.getTransactionsList().add(transaction);
        when(goalsJdbcTemplateRepository.findById(transaction.getGoalsId())).thenReturn(goal);

        Result result = service.update(transaction);


        assertFalse(result.isSuccess());
        assertEquals(result.getErrorMessages().get(0), "Transaction date is outside the goal range");

    }



    @Test
    void shouldNotUpdateWithNullGoal() {
        Transactions transaction = new Transactions();
        transaction.setTransactionId(1);
        transaction.setAppUserId(123);
        transaction.setGoalType("spending");
        transaction.setCategory("grocery");
        transaction.setDescription("Monthly grocery");
        transaction.setAmount(new BigDecimal("1000.00"));
        transaction.setTransactionDate(LocalDate.of(2022, 6, 15));


        Result result = service.create(transaction);

        assertFalse(result.isSuccess());
        assertEquals("Goal not found for given ID.", result.getErrorMessages().get(0));
        assertEquals(ResultType.INVALID, result.getResultType());
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