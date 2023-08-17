package org.example.models;

import org.apache.tomcat.jni.Local;
import org.example.data.GoalsJdbcTemplateRepository;
import org.example.data.GoalsRepository;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Goals {
    private int goalsId;
    private int appUserId;
    private int categoryId;
    private String type;
    private BigDecimal amount;
    private LocalDate startDate;
    private LocalDate endDate;
    List<Transaction> transactionsList = new ArrayList<>();

    GoalsJdbcTemplateRepository repository;

    public Goals(int goalsId, int appUserId, int categoryId, String type, BigDecimal amount, LocalDate startDate, LocalDate endDate, List<Transaction> transactionsList) {
        this.goalsId = goalsId;
        this.appUserId = appUserId;
        this.categoryId = categoryId;
        this.type = type;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.transactionsList = transactionsList;
    }


    public Goals(){}

    public Goals(int goalsId, int appUserId, int categoryId, String type, BigDecimal amount, LocalDate startDate, LocalDate endDate) {
        this.goalsId = goalsId;
        this.appUserId = appUserId;
        this.categoryId = categoryId;
        this.type = type;
        this.amount = amount;
        this.startDate = startDate;
        this.endDate = endDate;
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

    public void setGoalsId(int goalsId) {
        this.goalsId = goalsId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Goals goals = (Goals) o;
        return goalsId == goals.goalsId && appUserId == goals.appUserId && categoryId == goals.categoryId && Objects.equals(type, goals.type) && Objects.equals(amount, goals.amount) && Objects.equals(startDate, goals.startDate) && Objects.equals(endDate, goals.endDate) && Objects.equals(transactionsList, goals.transactionsList);
    }

    @Override
    public int hashCode() {
        return Objects.hash(goalsId, appUserId, categoryId, type, amount, startDate, endDate, transactionsList);
    }

    public boolean isCategoryAllowed(Goals goal){

            if(this.getGoalsId() == goal.getGoalsId()){
                return true;

            }
            if(this.getCategoryId() != goal.getCategoryId()){
                return true;
            }
            if(this.getCategoryId() == goal.getCategoryId()) {
                if(goal.getEndDate().isBefore(this.getStartDate()) ||
                        goal.getStartDate().isAfter(this.getEndDate())){
                    return true;
                }
            }

            return false;
    }
}
