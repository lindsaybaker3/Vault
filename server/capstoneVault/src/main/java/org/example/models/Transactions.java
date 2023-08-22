package org.example.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

public class Transactions {
    private int transactionId;
    private int appUserId;
    private int  goalsId;
    private String goalType;
    private String category;
    private String description;
    private BigDecimal amount;
    private LocalDate transactionDate;


    public Transactions(int transactionId, int appUserId, int goalsId, String goalType, String category, String description, BigDecimal amount, LocalDate transactionDate) {
        this.transactionId = transactionId;
        this.appUserId = appUserId;
        this.goalsId = goalsId;
        this.goalType = goalType;
        this.category = category;
        this.description = description;
        this.amount = amount;
        this.transactionDate = transactionDate;
    }

    public Transactions() {
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

    public String getGoalType() {
        return goalType;
    }

    public void setGoalType(String goalType) {
        this.goalType = goalType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
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
        if (!(o instanceof Transactions that)) return false;
        return getTransactionId() == that.getTransactionId() && getAppUserId() == that.getAppUserId() && getGoalsId() == that.getGoalsId() && Objects.equals(getGoalType(), that.getGoalType()) && Objects.equals(getCategory(), that.getCategory()) && Objects.equals(getDescription(), that.getDescription()) && Objects.equals(getAmount(), that.getAmount()) && Objects.equals(getTransactionDate(), that.getTransactionDate());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTransactionId(), getAppUserId(), getGoalsId(), getGoalType(), getCategory(), getDescription(), getAmount(), getTransactionDate());
    }
}
