package org.example.data;

import org.example.data.mappers.TransactionMapper;
import org.example.models.Transactions;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;


import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;

@Repository
public class TransactionsJdbcTemplateRepository implements TransactionsRepository {

    private final JdbcTemplate jdbcTemplate;

    public TransactionsJdbcTemplateRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Transactions> findByUserId(int appUserId) {
        final String sql = "SELECT t.transaction_id, t.app_user_id, t.goals_id, g.goal_type, c.category_name, " +
                "t.description, t.amount, t.transaction_date " +
                "FROM `transaction` t " +
                "JOIN goals g ON t.goals_id = g.goals_id " +
                "JOIN category c ON g.category_id = c.category_id " +
                "WHERE t.app_user_id = ?";

        return jdbcTemplate.query(sql, new TransactionMapper(), appUserId);
    }

    @Override
    public List<Transactions> findByUserId(int appUserId , LocalDate startDate, LocalDate endDate, String goalType) {

        final String sql = "SELECT t.transaction_id, t.app_user_id, t.goals_id, g.goal_type, c.category_name, " +
                "t.description, t.amount, t.transaction_date " +
                "FROM `transaction` t " +
                "JOIN goals g ON t.goals_id = g.goals_id " +
                "JOIN category c ON g.category_id = c.category_id " +
                "WHERE t.app_user_id = ? AND t.transaction_date between ? AND ? AND goal_type = ?";

        return jdbcTemplate.query(sql, new TransactionMapper(), appUserId, startDate, endDate, goalType);
    }


    public Transactions findByTransactionId(int transactionId) {
        final String sql = "SELECT t.transaction_id, t.app_user_id, t.goals_id, g.goalType, c.category_name, " +
                "t.description, t.amount, t.transaction_date " +
                "FROM `transaction` t " +
                "JOIN goals g ON t.goals_id = g.goals_id " +
                "JOIN category c ON g.category_id = c.category_id " +
                "WHERE t.transaction_id = ?";

        List<Transactions> transactions = jdbcTemplate.query(sql, new TransactionMapper(), transactionId);
        return transactions.stream().findFirst().orElse(null);
    }


    @Override
    public List<Transactions> findByGoalsId(int goalsId) {
        final String sql = "SELECT t.transaction_id, t.app_user_id, t.goals_id, g.goal_type, c.category_name, " +
                "t.description, t.amount, t.transaction_date " +
                "FROM `transaction` t " +
                "JOIN goals g ON t.goals_id = g.goals_id " +
                "JOIN category c ON g.category_id = c.category_id " +
                "WHERE t.goals_id = ?";

        return jdbcTemplate.query(sql, new TransactionMapper(), goalsId);
    }

    @Override
    public Transactions create(Transactions transactions) {
        final String sql = "INSERT INTO transaction (app_user_id, goals_id, amount, description, transaction_date) " +
                "VALUES (?, ?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();
        int rowsAffected = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, transactions.getAppUserId());
            ps.setInt(2, transactions.getGoalsId());
            ps.setBigDecimal(3, transactions.getAmount());
            ps.setString(4, transactions.getDescription());
            ps.setDate(5, Date.valueOf(transactions.getTransactionDate()));
            return ps;
        }, keyHolder);

        if (rowsAffected <= 0) {
            return null;
        }

        transactions.setTransactionId(keyHolder.getKey().intValue());
        return transactions;
    }

    @Override
    public boolean update(Transactions transactions) {
        final String sql = "UPDATE transaction SET "
                + "goals_id = ?, "
                + "amount = ?, "
                + "description = ?, "
                + "transaction_date = ? "
                + "WHERE transaction_id = ?";

        return jdbcTemplate.update(sql,
                transactions.getGoalsId(),
                transactions.getAmount(),
                transactions.getDescription(),
                Date.valueOf(transactions.getTransactionDate()),
                transactions.getTransactionId()) > 0;
    }



    @Override
    public boolean deleteById(int transactionId) {
        return jdbcTemplate.update(
                "delete from `transaction` where transaction_id = ?", transactionId) > 0;
    }


    @Override
    public boolean hasTransactions(int goalId){
        final String sql = "select count(*) from `transaction` where goals_id = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, goalId);
        if(count>0){
            return true;
        }
        return false;
    }
}
