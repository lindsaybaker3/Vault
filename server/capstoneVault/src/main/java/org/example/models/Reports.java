package org.example.models;

import java.time.LocalDate;
import java.util.Objects;

public class Reports {
    private int reportId;
    private int appUserId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String reportUrl;

    public Reports(int reportId, int appUserId, LocalDate startDate, LocalDate endDate, String reportUrl) {
        this.reportId = reportId;
        this.appUserId = appUserId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.reportUrl = reportUrl;
    }

    public int getReportId() {
        return reportId;
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

    public String getReportUrl() {
        return reportUrl;
    }

    public void setReportUrl(String reportUrl) {
        this.reportUrl = reportUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reports reports = (Reports) o;
        return reportId == reports.reportId && appUserId == reports.appUserId && Objects.equals(startDate, reports.startDate) && Objects.equals(endDate, reports.endDate) && Objects.equals(reportUrl, reports.reportUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reportId, appUserId, startDate, endDate, reportUrl);
    }
}
