package org.example.data;

import org.example.data.mappers.ReportsMapper;
import org.example.data.mappers.TransactionMapper;
import org.example.models.Reports;
import org.example.models.Transactions;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ReportsJdbcTemplateRepository implements ReportsRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReportsJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public Reports create(Reports report) {
        final String sql = "INSERT INTO reports (app_user_id, start_date, end_date, goal_type, report_url) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, report.getAppUserId());
            ps.setDate(2, Date.valueOf(report.getStartDate()));
            ps.setDate(3, Date.valueOf(report.getEndDate()));
            ps.setString(4, report.getGoalType());
            ps.setString(5, report.getReportUrl());
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        report.setReportId(keyHolder.getKey().intValue());
        return report;
    }

    @Override
    public Reports findById(int reportId) {
        final String sql = "SELECT * FROM reports " +
                "WHERE reports_id = ?";
        List<Reports> reports = jdbcTemplate.query(sql, new ReportsMapper(), reportId);
        return reports.stream().findFirst().orElse(null);
    }

    @Override
    public List<Reports> findByUserId(int appUserId) {
        final String sql = "SELECT * FROM reports r WHERE r.app_user_id = ?";
        return jdbcTemplate.query(sql, new ReportsMapper(), appUserId);
    }

    @Override
    public boolean update(Reports report) {
        final String sql = "UPDATE reports SET "
                + "report_url = ? "
                + "WHERE reports_id = ?";

        return jdbcTemplate.update(sql,
                report.getReportUrl(),
                report.getReportId()) > 0;
    }

    @Override
    public boolean deleteById(int reportId) {
        return jdbcTemplate.update(
                "delete from reports where reports_id = ?", reportId) > 0;
    }
}
