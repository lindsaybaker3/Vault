package org.example.data;

import org.example.models.Transaction;

import java.util.List;

public interface TransactionsRepository {

    List<Transaction> findByUserId(int appUserId);

    Transaction finfByReportId(int reportI);

    List<Transaction> findByGoalsId(int goalsId);

    Transaction create(Transaction transaction);

    boolean update(Transaction transaction);

    boolean deleteById(int  transactionId);


}
