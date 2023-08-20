package org.example.data.mappers;


import org.example.models.Transactions;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;


public class TransactionMapper implements RowMapper {


    @Override
    public Transactions mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        Transactions transactions = new Transactions();
        transactions.setTransactionId(resultSet.getInt("transaction_id"));
        transactions.setAppUserId(resultSet.getInt("app_user_id"));
        transactions.setGoalsId(resultSet.getInt("goals_id"));
        transactions.setGoalType(resultSet.getString("goal_type"));
        transactions.setCategory(resultSet.getString("category_name"));
        transactions.setAmount(resultSet.getBigDecimal("amount"));
        transactions.setDescription(resultSet.getString("description"));
        transactions.setTransactionDate(resultSet.getDate("transaction_date").toLocalDate());
        return transactions;
    }

}