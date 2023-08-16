package org.example.domain;

import org.example.data.BudgetCategoryJdbcTemplateRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import static org.junit.jupiter.api.Assertions.*;
@SpringBootTest
class BudgetCategoryServiceTest {

    @Autowired
    BudgetCategoryService service;

    @MockBean
    BudgetCategoryJdbcTemplateRepository repository;

    @Test
    void findByCategoryId() {
    }
}