package org.example.data;

import org.example.data.mappers.GoalsMapper;
import org.example.models.Goals;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;


import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
@Repository
public class GoalsJdbcTemplateRepository implements GoalsRepository {
    private final JdbcTemplate jdbcTemplate;

    public GoalsJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public List<Goals> findByUserId(int appUserId) {
        final String sql = "select * from goals "
                + "where app_user_id = ?;";

        return jdbcTemplate.query(sql, new GoalsMapper(), appUserId);


    }

    @Override
    public Goals findById(int goalId) {
            final String sql = "select * from goals "
                    + "where goals_id = ?;";

            Goals goal = jdbcTemplate.query(sql, new GoalsMapper(), goalId).stream()
                    .findFirst().orElse(null);


            return goal;
    }

    @Override
    public Goals addGoal(Goals goal) {
        final String sql = "insert into goals (app_user_id, category_id, goal_type, goal_amount, start_date, end_date)" +
                " values (?,?,?,?,?,?);";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, goal.getAppUserId());
            ps.setInt(2, goal.getCategoryId());
            ps.setString(3, goal.getType());
            ps.setBigDecimal(4, goal.getAmount());
            ps.setDate(5, Date.valueOf(goal.getStartDate()));
            ps.setDate(6, Date.valueOf(goal.getEndDate()));
            return ps;
        }, keyHolder);
        if (rowsAffected <= 0){
            return null;
        }
        goal.setGoalsId(keyHolder.getKey().intValue());
        return goal;
    }

    @Override
    public boolean update(Goals goals) {
        final String sql = "update goals set " +
                "app_user_id = ?, " +
                "category_id = ?, " +
                "goal_type = ?, " +
                "goal_amount = ?, " +
                "start_date = ?, " +
                "end_date = ? " +
                "where goals_id = ?;";

        return jdbcTemplate.update(sql,
                goals.getAppUserId(),
                goals.getCategoryId(),
                goals.getType(),
                goals.getAmount(),
                goals.getStartDate(),
                goals.getEndDate(),
                goals.getGoalsId()) > 0;
    }

    @Override
    public boolean deleteById(int goalId) {
        final String sql = "delete from goals where goals_id = ?;"; //does there need to be another delete? is there something in the database relying on this?
        return jdbcTemplate.update(sql, goalId)>0;

    }
}
