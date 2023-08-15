package org.example.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Transaction {
    private int transactionId;
    private int appUserId;
    private int appUsername;
    private int  goalsId;
    private String description;
    private BigDecimal amount;
    private LocalDate transactionDate;


    public Transaction(int transactionId, int appUserId, int appUsername, int goalsId, String description, BigDecimal amount, LocalDate transactionDate) {
        this.transactionId = transactionId;
        this.appUserId = appUserId;
        this.appUsername = appUsername;
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

    public int getAppUsername() {
        return appUsername;
    }

    public void setAppUsername(int appUsername) {
        this.appUsername = appUsername;
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
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return transactionId == that.transactionId && appUserId == that.appUserId && appUsername == that.appUsername && goalsId == that.goalsId && Objects.equals(description, that.description) && Objects.equals(amount, that.amount) && Objects.equals(transactionDate, that.transactionDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(transactionId, appUserId, appUsername, goalsId, description, amount, transactionDate);
    }
}
