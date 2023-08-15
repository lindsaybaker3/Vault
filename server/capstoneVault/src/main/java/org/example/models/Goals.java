package org.example.models;

import org.apache.tomcat.jni.Local;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public class Goals {
    private int goalsId;
    private int appUserId;
    private String appUsername;
    private int categoryId;
    private String type;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate endDate;
    List<Transaction> transactionsList;

    public Goals(int goalsId, int appUserId, String appUsername, int categoryId, String type, BigDecimal amount, LocalDate startDate, LocalDate endDate, List<Transaction> transactionsList) {
        this.goalsId = goalsId;
        this.appUserId = appUserId;
        this.appUsername = appUsername;
        this.categoryId = categoryId;
        this.type = type;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.transactionsList = transactionsList;
    }

    public Goals(){

    }

    public int getGoalsId() {
        return goalsId;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
    }

    public String getAppUsername() {
        return appUsername;
    }

    public void setAppUsername(String appUsername) {
        this.appUsername = appUsername;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<Transaction> getTransactionsList() {
        return transactionsList;
    }

    public void setTransactionsList(List<Transaction> transactionsList) {
        this.transactionsList = transactionsList;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Goals goals = (Goals) o;
        return goalsId == goals.goalsId && appUserId == goals.appUserId && categoryId == goals.categoryId && Objects.equals(appUsername, goals.appUsername) && Objects.equals(type, goals.type) && Objects.equals(amount, goals.amount) && Objects.equals(startDate, goals.startDate) && Objects.equals(endDate, goals.endDate) && Objects.equals(transactionsList, goals.transactionsList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(goalsId, appUserId, appUsername, categoryId, type, amount, startDate, endDate, transactionsList);
    }
}
