package org.example.data;

import org.example.data.mappers.TransactionMapper;
import org.example.models.Transaction;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;


import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class TransactionsJdbcTemplateRepository implements TransactionsRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionsJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public boolean hasTransactions(int goalId){
        final String sql = "select count(*) from transaction where goals_id = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, goalId);
        if(count>0){
            return true;
        }
        return false;
    }
    @Override
    public List<Transaction> findByUserId(int appUserId) {
        final String sql = "SELECT transaction_id, app_user_id, goals_id, amount, description, transaction_date " +
                "FROM transaction " +
                "WHERE app_user_id = ?";

        return jdbcTemplate.query(sql, new TransactionMapper(), appUserId);
    }


    @Override
    public Transaction findByTransactionId(int transactionId) {
        final String sql = "SELECT transaction_id, app_user_id, goals_id, amount, description, transaction_date " +
                "FROM transaction " +
                "WHERE transaction_id = ?";

        List<Transaction> transactions = jdbcTemplate.query(sql, new TransactionMapper(), transactionId);
        return transactions.stream().findFirst().orElse(null);
    }


    @Override
    public List<Transaction> findByGoalsId(int goalsId) {
        final String sql = "SELECT transaction_id, app_user_id, goals_id, amount, description, transaction_date " +
                "FROM transaction " +
                "WHERE goals_id = ?";

        return jdbcTemplate.query(sql, new TransactionMapper(), goalsId);
    }

    @Override
    public Transaction create(Transaction transaction) {
        final String sql = "INSERT INTO transaction (app_user_id, goals_id, amount, description, transaction_date) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, transaction.getAppUserId());
            ps.setInt(2, transaction.getGoalsId());
            ps.setBigDecimal(3, transaction.getAmount());
            ps.setString(4, transaction.getDescription());
            ps.setDate(5, Date.valueOf(transaction.getTransactionDate()));
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        transaction.setTransactionId(keyHolder.getKey().intValue());
        return transaction;
    }

    @Override
    public boolean update(Transaction transaction) {
        final String sql = "UPDATE transaction SET "
                + "goals_id = ?, "
                + "amount = ?, "
                + "description = ?, "
                + "transaction_date = ? "
                + "WHERE transaction_id = ?";

        return jdbcTemplate.update(sql,
                transaction.getGoalsId(),
                transaction.getAmount(),
                transaction.getDescription(),
                Date.valueOf(transaction.getTransactionDate()),
                transaction.getTransactionId()) > 0;
    }



    @Override
    public boolean deleteById(int transactionId) {
        return jdbcTemplate.update(
                "delete from transaction where transaction_id = ?", transactionId) > 0;
    }
}
