package org.example.domain;

import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Transaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionsJdbcTemplateRepository repository;

    public TransactionService(TransactionsJdbcTemplateRepository repository) {
        this.repository = repository;
    }

    public  List<Transaction> findByUserId(int appUserId){
        return repository.findByUserId(appUserId);
    }

    public Transaction findByTransactionId(int transactionId){
        return repository.findByTransactionId(transactionId);
    }

    public List<Transaction> findByGoalsId(int goalsId){
        return repository.findByGoalsId(goalsId);
    }


    public Result create(Transaction transaction) {
        Result result = validate(transaction);


        if (transaction != null && transaction.getTransactionId() > 0) {
            result.addErrorMessage("Transaction `id` should not be set.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            transaction = repository.create(transaction);
            result.setPayload(transaction);
        }

        return result;
    }

    public Result update(Transaction transaction)  {
        Result result = validate(transaction);

        if (transaction.getTransactionId() <= 0) {
            result.addErrorMessage("Transaction `id` is required.", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            if (repository.update(transaction)) {
                result.setPayload(transaction);
            } else {
                result.addErrorMessage("Transaction id %s was not found.", ResultType.NOT_FOUND, transaction.getTransactionId());
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

    private Result validate(Transaction transaction) {
        Result result = new Result();

        if (transaction == null) {
            result.addErrorMessage("Transaction cannot be null.", ResultType.INVALID);
            return result;
        }

        if (transaction.getTransactionDate() == null) {
            result.addErrorMessage("Transaction date is required.", ResultType.INVALID);
        } else if (transaction.getTransactionDate().isAfter(LocalDate.now())) {
            result.addErrorMessage("Transaction date needs to be a past date.", ResultType.INVALID);
        }

        if (transaction.getAmount() == null || transaction.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            result.addErrorMessage("Transaction amount is required and needs to be bigger than zero", ResultType.INVALID);
        }

        if (transaction.getDescription() == null || transaction.getDescription().isEmpty()) {
            result.addErrorMessage("Transaction description is required.", ResultType.INVALID);
        }

        if (transaction.getGoalsId() <= 0 ) {
            result.addErrorMessage("Goal is required.", ResultType.INVALID);
        }

        return result;
    }
}