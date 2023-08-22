package org.example.domain;

import org.example.data.GoalsJdbcTemplateRepository;
import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Goals;
import org.example.models.Transactions;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionsService {

    private final TransactionsJdbcTemplateRepository repository;
    private final GoalsJdbcTemplateRepository goalsJdbcTemplateRepository;

    public TransactionsService(TransactionsJdbcTemplateRepository repository, GoalsJdbcTemplateRepository goalsJdbcTemplateRepository) {
        this.repository = repository;
        this.goalsJdbcTemplateRepository = goalsJdbcTemplateRepository;
    }

    public  List<Transactions> findByUserId(int appUserId){
        return repository.findByUserId(appUserId);
    }

    public Transactions findByTransactionId(int transactionId){
        return repository.findByTransactionId(transactionId);
    }

    public List<Transactions> findByGoalsId(int goalsId){
        return repository.findByGoalsId(goalsId);
    }


    public Result create(Transactions transactions) {
        Result result = validate(transactions);


        if (transactions != null && transactions.getTransactionId() > 0) {
            result.addErrorMessage("Transaction `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            transactions = repository.create(transactions);
            result.setPayload(transactions);
        }

        return result;
    }

    public Result update(Transactions transactions)  {
        Result result = validate(transactions);

        if (transactions.getTransactionId() <= 0) {
            result.addErrorMessage("Transaction `id` is required.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(transactions)) {
                result.setPayload(transactions);
            } else {
                result.addErrorMessage("Transaction id %s was not found.", ResultType.NOT_FOUND, transactions.getTransactionId());
            }
        }
        return result;
    }

    public Result deleteById(int transactionId) {
        Result result = new Result();

        if (!repository.deleteById(transactionId)) {
            result.addErrorMessage("Transaction id %s was not found.", ResultType.NOT_FOUND, transactionId);
        }
        return result;
    }

    private Result validate(Transactions transactions) {
        Result result = new Result();

        if (transactions == null) {
            result.addErrorMessage("Transaction cannot be null.", ResultType.INVALID);
            return result;
        }

        if (transactions.getTransactionDate() == null) {
            result.addErrorMessage("Transaction date is required.", ResultType.INVALID);
        } else if (transactions.getTransactionDate().isAfter(LocalDate.now())) {
            result.addErrorMessage("Transaction date needs to be a past date.", ResultType.INVALID);
        } else {
            Goals goal = goalsJdbcTemplateRepository.findById(transactions.getGoalsId());
            LocalDate goalStartDate = goal.getStartDate();
            LocalDate goalEndDate = goal.getEndDate();
            LocalDate transactionDate = transactions.getTransactionDate();

            if (!(transactionDate.isEqual(goalStartDate) || transactionDate.isEqual(goalEndDate) ||
                    (transactionDate.isAfter(goalStartDate) && transactionDate.isBefore(goalEndDate)))) {
                result.addErrorMessage("Transaction date is outside the goal range", ResultType.INVALID);
            }
        }

        if (transactions.getAmount() == null || transactions.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            result.addErrorMessage("Transaction amount is required and needs to be bigger than zero", ResultType.INVALID);
        }

        if (transactions.getDescription() == null || transactions.getDescription().isEmpty()) {
            result.addErrorMessage("Transaction description is required.", ResultType.INVALID);
        }

        return result;
    }

}
