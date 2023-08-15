package org.example.data;

import org.example.models.Transaction;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

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
//        int reportId = 1;
//       Transaction transaction = repository.findByReportId(reportId);
//        assertTrue( transaction.size() >= 1);
    }

    @Test
    void shouldNotFindByReportId() {
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
    void deleteById() {
    }
}