package org.example.data;

import org.example.models.Transaction;

import java.util.List;

public interface TransactionsRepository {

    boolean hasTransactions(int goalId);

    List<Transaction> findByUserId(int appUserId);

    Transaction findByTransactionId(int transactionId);

    List<Transaction> findByGoalsId(int goalsId);

    Transaction create(Transaction transaction);

    boolean update(Transaction transaction);

    boolean deleteById(int  transactionId);


}
