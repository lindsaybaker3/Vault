package org.example.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Transaction {
    private int transactionId;
    private int appUserId;
    private int  goalsId;
    private String description;
    private BigDecimal amount;
    private LocalDate transactionDate;


    public Transaction(int transactionId, int appUserId, int goalsId, String description, BigDecimal amount, LocalDate transactionDate) {
        this.transactionId = transactionId;
        this.appUserId = appUserId;
        this.goalsId = goalsId;
        this.description= description;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }



    public Transaction() {
    }


    public int getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(int transactionId) {
        this.transactionId = transactionId;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
    }

    public int getGoalsId() {
        return goalsId;
    }

    public void setGoalsId(int goalsId) {
        this.goalsId = goalsId;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
        if (!(o instanceof Transaction that)) return false;
        return getTransactionId() == that.getTransactionId() && getAppUserId() == that.getAppUserId() && getGoalsId() == that.getGoalsId() && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(getAmount(), that.getAmount()) && Objects.equals(getTransactionDate(), that.getTransactionDate());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTransactionId(), getAppUserId(), getGoalsId(), getDescription(), getAmount(), getTransactionDate());
    }
}
