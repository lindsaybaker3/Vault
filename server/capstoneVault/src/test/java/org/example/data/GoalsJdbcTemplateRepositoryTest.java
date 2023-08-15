package org.example.data;

import org.example.models.Goals;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class GoalsJdbcTemplateRepositoryTest {

    final static int NEXT_ID = 5;

    @Autowired
    GoalsJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void findByUserId() {
        int app_user_id = 1;
        List<Goals> result = repository.findByUserId(app_user_id);
        assertTrue(result.size() >=1);
    }

    @Test
    void shouldNotFindNonExisitngId() {
        int app_user_id = 1000;
        List<Goals> result = repository.findByUserId(app_user_id);
        assertTrue(result.isEmpty());
    }

    @Test
    void findById() {
        int goal_id = 1;
        Goals result = repository.findById(goal_id);
        assertTrue(result != null);
        assertEquals("spending", result.getType());
    }

    @Test
    void shouldNotFindNotExistingGoal() {
        int goal_id = 1000;
        Goals result = repository.findById(goal_id);
        assertTrue(result == null);
    }

    @Test
    void addGoal() {
        Goals goal = new Goals();
        int countBeforeAdd = repository.findByUserId(1).size();
        goal.setAppUserId(1);
        goal.setCategoryId(1);
        goal.setType("spending");
        goal.setAmount(BigDecimal.valueOf(500.00));
        goal.setStartDate(LocalDate.now());
        goal.setEndDate(LocalDate.now().plusDays(30));
        Goals actual = repository.addGoal(goal);
        assertNotNull(actual);
        assertEquals(NEXT_ID, actual.getGoalsId());
        assertEquals(countBeforeAdd + 1, repository.findByUserId(1).size());
    }



    @Test
    void update() {
        Goals goal = new Goals();
        goal.setAppUserId(1);
        goal.setCategoryId(1);
        goal.setType("spending");
        goal.setAmount(BigDecimal.valueOf(500.00));
        goal.setStartDate(LocalDate.now());
        goal.setEndDate(LocalDate.now().plusDays(30));
        goal.setGoalsId(2);
        assertTrue(repository.update(goal));
    }

    @Test
    void ShouldNotUpdate() {
        Goals goal = new Goals();
        goal.setAppUserId(1);
        goal.setCategoryId(1);
        goal.setType("spending");
        goal.setAmount(BigDecimal.valueOf(500.00));
        goal.setStartDate(LocalDate.now());
        goal.setEndDate(LocalDate.now().plusDays(30));
        goal.setGoalsId(22);
        assertFalse(repository.update(goal));
    }

    @Test
    void deleteById() {
        assertTrue(repository.deleteById(3));
        assertFalse(repository.deleteById(3));
    }
}