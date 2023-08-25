package org.example.domain;



import org.example.data.ReportsJdbcTemplateRepository;

import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Reports;

import org.example.models.Transactions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
class ReportsServiceTest {

    @Autowired
    ReportsService service;

    @MockBean
    ReportsJdbcTemplateRepository repository;

    @MockBean
    TransactionsJdbcTemplateRepository transactionsJdbcTemplateRepository;


    @Test
    void findByUserId() {
        when(repository.findByUserId(1)).thenReturn(List.of(
                new Reports(1, 1, LocalDate.of(2023, 8, 1), LocalDate.of(2023, 8, 30), "spending", "https://example.com/report.pdf"),
                new Reports(2, 1, LocalDate.of(2023, 8, 1), LocalDate.of(2023, 8, 30), "spending", "https://example.com/report.pdf")
        ));

        List<Reports> report = service.findByUserId(1);

        assertEquals(2, report.size());
    }


    @Test
    void findById() {
        when(repository.findById(1)).thenReturn(
                new Reports(1, 1, LocalDate.of(2023, 8, 1), LocalDate.of(2023, 8, 30), "spending", "https://example.com/report.pdf")
        );

        Reports report = service.findById(1);
    }


    @Test
    void ShouldNotCreateWithNullStartDate() {
        // Create the report with a null start date
        Reports report = new Reports(1, 1, null, LocalDate.of(2023, 8, 30), "spending", "https://example.com/report.pdf");

        // Mock the repository calls
        when(transactionsJdbcTemplateRepository.findByUserId(report.getAppUserId())).thenReturn(
                List.of(
                        new Transactions(1, 1, 1, "saving", "travel", "travel iceland", new BigDecimal("100"),
                                LocalDate.of(2023, 8, 15)),
                        new Transactions(2, 1, 1, "saving", "grocery montly", "groceries", new BigDecimal("200"),
                                LocalDate.of(2023, 8, 16))
                )
        );

        // Call the service method
//        Result result = service.create(report);

        // Assertions
//        assertFalse(result.isSuccess());
//        assertTrue(result.getErrorMessages().contains("Report date is required."));
    }


    @Test
    void shouldNotDeleteNonExistentReport() {
        int reportId = 1000;
        Result result = service.deleteById(reportId);

        assertFalse(result.isSuccess());
        assertEquals(1, result.getErrorMessages().size());
        assertEquals("Report id " + reportId + " was not found.", result.getErrorMessages().get(0));
    }

    @Test
    void shouldDelete() {
        when(repository.deleteById(1)).thenReturn(true);
        Result result = service.deleteById(1);
        assertTrue(result.isSuccess());
    }
}