package org.example.data;

import org.example.domain.Result;
import org.example.models.Reports;
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
class ReportsJdbcTemplateRepositoryTest {


    @Autowired
    ReportsJdbcTemplateRepository repository;

    @Autowired
    KnownGoodState knownGoodState;

    @BeforeEach
    void setup() {
        knownGoodState.set();
    }


    @Test
    void findById() {
        int reportId = 1;
        Reports report = repository.findById(reportId);
        assertNotNull(report != null);
    }

    @Test
    void findByUserId() {
        int appUserId = 1;
        List<Reports> result = repository.findByUserId(appUserId);
        assertTrue(result.size() >= 1);
    }

    @Test
    void shouldCreate() {
        Reports report = new Reports();

        report.setAppUserId(1);
        report.setStartDate(LocalDate.of(2023, 8, 1));
        report.setEndDate(LocalDate.of(2023, 8, 31));
        report.setGoalType("saving");
        report.setReportUrl("https://example.com/report.pdf");

        Reports result = repository.create(report);

        assertNotNull(result);
        assertNotNull(result.getReportId());
    }


    @Test
    void shouldUpdate() {
        Reports report = new Reports();

        report.setReportId(1);
        report.setAppUserId(1);
        report.setStartDate(LocalDate.of(2023, 8, 1));
        report.setEndDate(LocalDate.of(2023, 8, 31));
        report.setGoalType("saving");
        report.setReportUrl("https://example.com/report.pdf");

        assertTrue(repository.update(report));

        Reports updatedReport = repository.findById(1);

        assertNotNull(updatedReport);
        assertEquals(report.getStartDate(), updatedReport.getStartDate());
        assertEquals(report.getEndDate(), updatedReport.getEndDate());
        assertEquals(report.getReportUrl(), updatedReport.getReportUrl());
    }


    @Test
    void shouldDelete() {
        assertTrue(repository.deleteById(2));
    }
}