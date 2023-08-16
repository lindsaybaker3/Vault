package org.example.data;

import org.example.models.BudgetCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class BudgetCategoryJdbcTemplateRepositoryTest {

    @Autowired
    BudgetCategoryJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }

    @Test
    void findAll() {
        List<BudgetCategory> result = repository.findAll();
        assertTrue(result.size() >= 4);
    }

    @Test
    void findByCategoryId() {
        int categoryId = 4;

        BudgetCategory result = repository.findByCategoryId(categoryId);
        assertTrue(result != null);
        assertEquals(result,"Shopping");

    }
}