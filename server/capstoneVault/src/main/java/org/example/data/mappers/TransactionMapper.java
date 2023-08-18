package org.example.data.mappers;


import org.example.models.Transaction;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;


public class TransactionMapper implements RowMapper {


    @Override
    public Transaction mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(resultSet.getInt("transaction_id"));
        transaction.setAppUserId(resultSet.getInt("app_user_id"));
        transaction.setGoalsId(resultSet.getInt("goals_id"));
        transaction.setGoal_type(resultSet.getString("goal_type"));
        transaction.setCategory(resultSet.getString("category_name"));
        transaction.setAmount(resultSet.getBigDecimal("amount"));
        transaction.setDescription(resultSet.getString("description"));
        transaction.setTransactionDate(resultSet.getDate("transaction_date").toLocalDate());
        return transaction;
    }

}