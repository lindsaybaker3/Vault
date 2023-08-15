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
    public BudgetCategory findByCategoryId(){

        return null;
    }

}
