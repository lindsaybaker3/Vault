package org.example.data.mappers;

import org.example.models.Goals;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class GoalsMapper implements RowMapper<Goals> {

@Override
public Goals mapRow(ResultSet resultSet, int i) throws SQLException {
    Goals goal = new Goals();
    goal.setGoalsId(resultSet.getInt("goals_id"));
    goal.setAppUserId(resultSet.getInt("app_user_id"));
    goal.setCategoryId(resultSet.getInt("category_id"));
    goal.setType(resultSet.getString("goal_type"));
    goal.setAmount(resultSet.getBigDecimal("goal_amount"));
    goal.setStartDate(resultSet.getDate("start_date").toLocalDate());
    goal.setEndDate(resultSet.getDate("end_date").toLocalDate());
    return goal;
}
}
