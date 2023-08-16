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
        assertTrue(result.getErrorMessages().contains("must choose a valid category"));
    }

    @Test
    void shouldNotAddNonExistingCategory(){
        Goals goal = new Goals(1, 1, 1000, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("must choose a valid category"));
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
    @Test
    void shouldNotAddWhenStartDateIsNull() {
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), null, LocalDate.now().plusDays(20));
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("start date must be in the future"));
    }
//
    @Test
    void shouldNotAddWhenEndDateIsNull(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), null);
        Result result = service.addGoal(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("end date cannot be before start date"));
    }

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

//    @Test
//    void shouldNotAddDuplicateCategory() {
//        Goals existing = new Goals();
//        existing.setAppUserId(1);
//        existing.setCategoryId(1);
//        existing.setType("spending");
//        existing.setAmount(BigDecimal.valueOf(15.00));
//        existing.setStartDate(LocalDate.now().plusDays(2));
//        existing.setEndDate(LocalDate.now().plusDays(30));
//        Goals goalsNew = new Goals();
//        goalsNew.setAppUserId(1);
//        goalsNew.setCategoryId(1);
//        goalsNew.setType("saving");
//        goalsNew.setAmount(BigDecimal.valueOf(20.00));
//        goalsNew.setStartDate(LocalDate.now().plusDays(2));
//        goalsNew.setEndDate(LocalDate.now().plusDays(30));
//
//        when(repository.findByUserId(1)).thenReturn(List.of(existing));
//
//        Result<Goals> result = service.addGoal(goalsNew);
//
//        assertFalse(result.isSuccess());
//        assertEquals(ResultType.INVALID, result.getResultType());
//        assertTrue(result.getErrorMessages().contains("A goal with that category is already in use"));
//    }

//    @Test
//    void addGoal() {
//        Goals goal = new Goals();
//        goal.setAppUserId(1);
//        goal.setCategoryId(2);
//        goal.setType("spending");
//        goal.setAmount(BigDecimal.valueOf(15.00));
//        goal.setStartDate(LocalDate.now().plusDays(2));
//        goal.setEndDate(LocalDate.now().plusDays(30));
//
//        when(repository.addGoal(goal)).thenReturn(goal);
//        Result result = service.addGoal(goal);
//        assertTrue(result.isSuccess());
//        assertEquals(goal.getAmount(), BigDecimal.valueOf(15.00));
//    }

    @Test
    void shouldNotUpdateWhenCategoryIsZero(){
        Goals goal = new Goals(1, 1, 0, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("must choose a valid category"));
    }

    @Test
    void shouldNotUpdateWhenAmountIsNull(){
        Goals goal = new Goals(1, 1, 1, "spending", null, LocalDate.now(), LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("Amount must be a positive number"));
    }
    @Test
    void shouldNotUpdateWhenStartDateIsNull() {
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), null, LocalDate.now().plusDays(20));
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("start date must be in the future"));
    }
    //
    @Test
    void shouldNotUpdateWhenEndDateIsNull(){
        Goals goal = new Goals(1, 1, 1, "spending", BigDecimal.valueOf(100.00), LocalDate.now(), null);
        Result result = service.update(goal);
        assertEquals(ResultType.INVALID, result.getResultType());
        assertTrue(result.getErrorMessages().contains("end date cannot be before start date"));
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

//    @Test
//    void shouldNotUpdateDuplicateCategory() {
//        Goals existing = new Goals();
//        existing.setGoalsId(1);
//        existing.setAppUserId(1);
//        existing.setCategoryId(1);
//        existing.setType("spending");
//        existing.setAmount(BigDecimal.valueOf(15.00));
//        existing.setStartDate(LocalDate.now().plusDays(2));
//        existing.setEndDate(LocalDate.now().plusDays(30));
//        Goals goalsNew = new Goals();
//        goalsNew.setGoalsId(1);
//        goalsNew.setAppUserId(1);
//        goalsNew.setCategoryId(1);
//        goalsNew.setType("saving");
//        goalsNew.setAmount(BigDecimal.valueOf(20.00));
//        goalsNew.setStartDate(LocalDate.now().plusDays(2));
//        goalsNew.setEndDate(LocalDate.now().plusDays(30));
//
//        when(repository.findByUserId(1)).thenReturn(List.of(existing));
//
//        Result<Goals> result = service.update(goalsNew);
//
//        assertFalse(result.isSuccess());
//        assertEquals(ResultType.INVALID, result.getResultType());
//        assertTrue(result.getErrorMessages().contains("A goal with that category is already in use"));
//    }

//    @Test
//    void update() {
//        Goals goals = new Goals();
//        goals.setGoalsId(1);
//        goals.setAppUserId(1);
//        goals.setCategoryId(1);
//        goals.setType("spending");
//        goals.setAmount(BigDecimal.valueOf(15.00));
//        goals.setStartDate(LocalDate.now().plusDays(2));
//        goals.setEndDate(LocalDate.now().plusDays(30));
//
//        when(repository.update(goals)).thenReturn(true);
//        Result<Goals> actual = service.update(goals);
//        assertEquals(ResultType.SUCCESS, actual.getResultType());
//    }

    @Test
    void shouldNotDeleteAGoalWithTransaction() {
        when(transactionsRepository.findByGoalsId(1)).thenReturn(List.of(
                new Transaction(1, 1, 1, "groceries", BigDecimal.valueOf(20.00), LocalDate.now().plusDays(-3)),
                new Transaction(2, 1, 1, "TacoBell", BigDecimal.valueOf(10.00), LocalDate.now().plusDays(-5))));
        when(repository.deleteById(1)).thenReturn(false);
        Result result = service.deleteById(1);

        assertFalse(result.isSuccess());
    }

    @Test
    void deleteById() {
        when(transactionsRepository.findByGoalsId(1)).thenReturn(List.of());
        when(repository.deleteById(1)).thenReturn(true);
        Result result = service.deleteById(1);

        assertTrue(result.isSuccess());
    }
}