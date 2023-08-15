package org.example.data.mappers;


import org.example.models.Transaction;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;


public class TransactionMapper implements RowMapper {


    @Override
    public Object mapRow(ResultSet resultSet, int rowNum) throws SQLException {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(resultSet.getInt("transaction_id"));
        transaction.setAppUserId(resultSet.getInt("app_user_id"));
        transaction.setGoalsId(resultSet.getInt("goals_id"));
        transaction.setAmount(resultSet.getBigDecimal("amount"));
        transaction.setDescription(resultSet.getString("description"));
        transaction.setTransactionDate(resultSet.getDate("transaction_date").toLocalDate());
        return transaction;
    }

}