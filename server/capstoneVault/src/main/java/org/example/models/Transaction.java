package org.example.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Transaction {
    private int transactionId;
    private int appUserId;
    private int appUsername;
    private int budgetId;
    private String type;
    private BigDecimal amount;
    private LocalDate transactionDate;

    public Transaction(int transactionId, int appUserId, int appUsername, int budgetId, String type, BigDecimal amount, LocalDate transactionDate) {
        this.transactionId = transactionId;
        this.appUserId = appUserId;
        this.appUsername = appUsername;
        this.budgetId = budgetId;
        this.type = type;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    public int getTransactionId() {
        return transactionId;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
    }

    public int getAppUsername() {
        return appUsername;
    }

    public void setAppUsername(int appUsername) {
        this.appUsername = appUsername;
    }

    public int getBudgetId() {
        return budgetId;
    }

    public void setBudgetId(int budgetId) {
        this.budgetId = budgetId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return transactionId == that.transactionId && appUserId == that.appUserId && appUsername == that.appUsername && budgetId == that.budgetId && Objects.equals(type, that.type) && Objects.equals(amount, that.amount) && Objects.equals(transactionDate, that.transactionDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(transactionId, appUserId, appUsername, budgetId, type, amount, transactionDate);
    }
}
