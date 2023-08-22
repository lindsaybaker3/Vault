package org.example.data;


import org.example.models.Reports;
import org.example.models.Transactions;

import java.util.List;


public interface ReportsRepository {
    Reports create(Reports report);

    Reports findById(int reportId);

    List<Reports> findByUserId(int appUserId);

    boolean update(Reports report);

    boolean deleteById(int  transactionId);
}
