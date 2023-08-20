package org.example.data.mappers;

import org.example.models.Reports;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;


public class ReportsMapper implements RowMapper {

    public Reports mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        Reports report = new Reports();
        report.setReportId(resultSet.getInt("reports_id"));
        report.setAppUserId(resultSet.getInt("app_user_id"));
        report.setStartDate(resultSet.getDate("start_date").toLocalDate());
        report.setStartDate(resultSet.getDate("end_date").toLocalDate());
        report.setReportUrl(resultSet.getString("report_url"));
        return report;
    }
}


