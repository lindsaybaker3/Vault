package org.example.data;

import org.example.data.mappers.BudgetCategoryMapper;
import org.example.models.BudgetCategory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BudgetCategoryJdbcTemplateRepository implements BudgetCategoryRepository {

    private final JdbcTemplate jdbcTemplate;

    public BudgetCategoryJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<BudgetCategory> findAll(){
        final String sql = "select * from category;";
        return jdbcTemplate.query(sql, new BudgetCategoryMapper());
    }

    @Override
    public List<BudgetCategory> findByGoalType(String type) {
        final String sql = "SELECT c.category_id, c.category_name " +
                "FROM goals g " +
                "JOIN category c ON g.category_id = c.category_id " +
                "WHERE g.goalType = ?";

        return jdbcTemplate.query(sql, new BudgetCategoryMapper(), type);
    }


    @Override
    public BudgetCategory findByCategoryId(int categoryId){
        final String sql= "select * from category " +
                "where category_id = ?;";
        BudgetCategory category = jdbcTemplate.query(sql,new BudgetCategoryMapper(),categoryId).stream()
                .findFirst().orElse(null);
        return category;
    }

}
