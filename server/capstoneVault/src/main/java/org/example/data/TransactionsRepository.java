package org.example.data;

import org.example.models.Transactions;

import java.time.LocalDate;
import java.util.List;

public interface TransactionsRepository {

    List<Transactions> findByUserId(int appUserId);

    List<Transactions> findByUserId(int appUserId , LocalDate startDate, LocalDate endDate, String goalType);
    Transactions findByTransactionId(int transactionId);

    List<Transactions> findByGoalsId(int goalsId);

    Transactions create(Transactions transactions);

    boolean update(Transactions transactions);

    boolean deleteById(int  transactionId);

    boolean hasTransactions(int goalId);


}
