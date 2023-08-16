package org.example.domain;

import org.example.data.GoalsJdbcTemplateRepository;
import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Goals;
import org.example.models.Transaction;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class GoalsServiceTest {
    @Autowired
    GoalsService service;

    @MockBean
    GoalsJdbcTemplateRepository repository;

    @MockBean
    TransactionsJdbcTemplateRepository transactionsRepository;

    @Test
    void shouldFindAllForUser1() {
        when(repository.findByUserId(1)).thenReturn(List.of(
                new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(30)),
                new Goals(2, 1, 2, "saving", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(30))
        ));
        List<Goals> goals = service.findByUserId(1);

        assertEquals(2, goals.size());
    }

    @Test
    void findById() {
        Goals goalExpected = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), LocalDate.now().plusDays(-10), LocalDate.now().plusDays(20));
        when(repository.findById(1)).thenReturn(goalExpected);
        when(transactionsRepository.findByGoalsId(1)).thenReturn(List.of(
                new Transaction(1, 1, 1, "groceries", BigDecimal.valueOf(20.00), LocalDate.now().plusDays(-3)),
                new Transaction(2, 1, 1, "TacoBell", BigDecimal.valueOf(10.00), LocalDate.now().plusDays(-5))
        ));

        Goals actual = service.findById(1);
        assertEquals(goalExpected, actual);
        assertEquals(2, goalExpected.getTransactionsList().size());
    }


    @Test
    void shouldNotAddWhenCategoryIsZero(){
        Goals goal = new Goals(1, 1, 0, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("must choose a category"));
    }

    @Test
    void shouldNotAddWhenTypeIsNullOrBlank(){
        Goals goal = new Goals(1, 1, 1, " ", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());

        Goals goal2 = new Goals(1, 1, 0, null, BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result2 = service.addGoal(goal2);
        assertEquals(ResultType.INVALID, result2.getResultType());
        assertTrue(result2.getErrorMessages().contains("must indicate if this is a spending or saving goal"));
    }

    @Test
    void shouldNotAddWhenAmountIsNull(){
        Goals goal = new Goals(1, 1, 1, "spending", null, LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));
    }
//    @Test
//    void shouldNotAddWhenStartDateIsNull() {
//        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), null, LocalDate.now().plusDays(20));
//        Result result = service.addGoal(goal);
//        assertEquals(ResultType.INVALID, result.getResultType());
//        assertTrue(result.getErrorMessages().contains("start date is required"));
//    }
//
//    @Test
//    void shouldNotAddWhenEndDateIsNull(){
//        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), null);
//        Result result = service.addGoal(goal);
//        assertEquals(ResultType.INVALID, result.getResultType());
//        assertTrue(result.getErrorMessages().contains("end date is required"));
//    }

    @Test
    void shouldNotAddWhenAmountIsLessThan0(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(-15.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));

        Goals goal2 = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(0), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result2 = service.addGoal(goal2);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));
    }

    @Test
    void shouldNotAddWhenStartDateIsInThePast(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(15.00), LocalDate.now().plusDays(-10), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("start date must be in the future"));
    }

    @Test
    void shouldNotAddWhenEndDateIsBeforeStartDate(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(15.00), LocalDate.now(), LocalDate.now().plusDays(-20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("end date cannot be before start date"));
    }

    @Test
    void addGoal() {
        Goals goal = new Goals();
        goal.setAppUserId(1);
        goal.setCategoryId(1);
        goal.setType("spending");
        goal.setAmount(BigDecimal.valueOf(15.00));
        goal.setStartDate(LocalDate.now().plusDays(2));
        goal.setEndDate(LocalDate.now().plusDays(30));

        when(repository.addGoal(goal)).thenReturn(goal);
        Result result = service.addGoal(goal);
        assertTrue(result.isSuccess());
        assertEquals(goal.getAmount(), BigDecimal.valueOf(15.00));
    }

    @Test
    void shouldNotUpdateWhenCategoryIsZero(){
        Goals goal = new Goals(1, 1, 0, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("must choose a category"));
    }

    @Test
    void shouldNotUpdateWhenTypeIsNullOrBlank(){
        Goals goal = new Goals(1, 1, 1, " ", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());

        Goals goal2 = new Goals(1, 1, 0, null, BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result2 = service.update(goal2);
        assertEquals(ResultType.INVALID, result2.getResultType());
        assertTrue(result2.getErrorMessages().contains("must indicate if this is a spending or saving goal"));
    }

    @Test
    void shouldNotUpdateWhenAmountIsLessThan0(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(-15.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));

        Goals goal2 = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(0), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result2 = service.update(goal2);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));
    }

    @Test
    void shouldNotUpdateWhenStartDateIsInThePast(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(15.00), LocalDate.now().plusDays(-10), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("start date must be in the future"));
    }

    @Test
    void shouldNotUpdateWhenEndDateIsBeforeStartDate(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(15.00), LocalDate.now(), LocalDate.now().plusDays(-20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("end date cannot be before start date"));
    }

    @Test
    void update() {
    }

    @Test
    void deleteById() {
    }
}