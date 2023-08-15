package org.example.data.mappers;

import org.example.models.BudgetCategory;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class BudgetCategoryMapper implements RowMapper<BudgetCategory> {

    @Override
    public BudgetCategory mapRow(ResultSet resultSet, int i) throws SQLException {
        BudgetCategory budgetCategory = new BudgetCategory();
        budgetCategory.setCategoryId(resultSet.getInt("category_id"));
        budgetCategory.setCategoryName(resultSet.getString("category_name"));

        return budgetCategory;
    }
}
