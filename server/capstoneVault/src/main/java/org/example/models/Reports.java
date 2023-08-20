package org.example.models;

import java.time.LocalDate;
import java.util.Objects;

public class Reports {
    private int reportId;
    private int appUserId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String goalType;
    private String reportUrl;

    public Reports(int reportId, int appUserId, LocalDate startDate, LocalDate endDate, String goalType, String reportUrl) {
        this.reportId = reportId;
        this.appUserId = appUserId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.goalType = goalType;
        this.reportUrl = reportUrl;
    }

    public Reports() {
    }

    public int getReportId() {
        return reportId;
    }

    public void setReportId(int reportId) {
        this.reportId = reportId;
    }

    public int getAppUserId() {
        return appUserId;
    }

    public void setAppUserId(int appUserId) {
        this.appUserId = appUserId;
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

    public String getGoalType() {
        return goalType;
    }

    public void setGoalType(String goalType) {
        this.goalType = goalType;
    }

    public String getReportUrl() {
        return reportUrl;
    }

    public void setReportUrl(String reportUrl) {
        this.reportUrl = reportUrl;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Reports reports)) return false;
        return getReportId() == reports.getReportId() && getAppUserId() == reports.getAppUserId() && Objects.equals(getStartDate(), reports.getStartDate()) && Objects.equals(getEndDate(), reports.getEndDate()) && Objects.equals(getGoalType(), reports.getGoalType()) && Objects.equals(getReportUrl(), reports.getReportUrl());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getReportId(), getAppUserId(), getStartDate(), getEndDate(), getGoalType(), getReportUrl());
    }
}
