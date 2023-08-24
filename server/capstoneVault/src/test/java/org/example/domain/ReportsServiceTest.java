package org.example.domain;


import org.example.data.GoalsJdbcTemplateRepository;
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


    //
//    private Result validate(Reports report) {
//        Result result = new Result();
//
//        if (report == null) {
//            result.addErrorMessage("Report cannot be null.", ResultType.INVALID);
//            return result;
//        }
//
//        if (report.getStartDate() == null || report.getEndDate() == null) {
//            result.addErrorMessage("Start date and End date cannot be null.", ResultType.INVALID);
//        } else if (report.getStartDate().isAfter(report.getEndDate())) {
//            result.addErrorMessage("End date cannot be before start date.", ResultType.INVALID);
//        }
//
//        if (report.getEndDate().isAfter(LocalDate.now())) {
//            result.addErrorMessage("Report End date cannot be in the future.", ResultType.INVALID);
//        }
//
//        if (report.getGoalType() == null || report.getGoalType().isEmpty()) {
//            result.addErrorMessage("Goal type is required.", ResultType.INVALID);
//        }
//
//        return result;
//    }

//    private int reportId;
//    private int appUserId;
//    private LocalDate startDate;
//    private LocalDate endDate;
//    private String goalType;
//    private String reportUrl;
//

//
//    @Test
//    void create() {
//        Reports report = new Reports(1, 1, LocalDate.of(2023, 8, 1), LocalDate.of(2023, 8, 30), "spending", "https://example.com/report.pdf");
//
//        when(repository.create(report)).thenReturn(report);
//        Result result = service.create(report);
//
//        assertTrue(result.isSuccess());
//        assertNull(result.getErrorMessages());
//    }


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