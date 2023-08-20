package org.example.data;


import org.example.models.Reports;


public interface ReportsRepository {
    Reports create(Reports report);

    Reports findById(int reportId);

    boolean deleteById(int  transactionId);
}
