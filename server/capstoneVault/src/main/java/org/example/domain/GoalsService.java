package org.example.domain;

import org.example.data.GoalsJdbcTemplateRepository;
import org.example.data.TransactionsJdbcTemplateRepository;
import org.example.models.Goals;
import org.example.models.Transaction;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class GoalsService {

    private final GoalsJdbcTemplateRepository repository;

    private final TransactionsJdbcTemplateRepository transactionRepository;

    public GoalsService(GoalsJdbcTemplateRepository repository, TransactionsJdbcTemplateRepository transactionRepository) {
        this.repository = repository;
        this.transactionRepository = transactionRepository;
    }

    public List<Goals> findByUserId(int appUserId){
        return repository.findByUserId(appUserId);
    }
    public Goals findById(int goalId){
        Goals goal = repository.findById(goalId);
        List<Transaction> transactions = transactionRepository.findByGoalsId(goalId);
        goal.setTransactionsList(transactions);
        return goal;
    }

    public Result addGoal(Goals goal) throws DataAccessException {
        Result result = validate(goal);

        if(goal != null && goal.getGoalsId() > 0) {
            result.addErrorMessage("goal Id should not be set", ResultType.INVALID);
        }
        if (result.isSuccess()) {
            goal = repository.addGoal(goal);
            result.setPayload(goal);
        }
        return result;
    }

    public Result update(Goals goal) throws DataAccessException {
        Result result = validate(goal);

        if(goal.getGoalsId() <= 0){
            result.addErrorMessage("goal Id is required", ResultType.INVALID);
        }
        if(result.isSuccess()) {
            if(repository.update(goal)){
                result.setPayload(goal);
            } else {
                result.addErrorMessage("goal Id %s was not found", ResultType.NOT_FOUND, goal.getGoalsId());
            }
        }
        return result;
    }

    public Result deleteById(int id) throws DataAccessException {
        Result result = new Result();
        if(!repository.deleteById(id)) {
            result.addErrorMessage("Goal id %s was not found", ResultType.NOT_FOUND, id);
        }
        return result;
    }

    private Result validate(Goals goal) throws DataAccessException {
        Result result = new Result();

        if(goal == null) {
            result.addErrorMessage("Goal cannot be null", ResultType.INVALID);
            return result;
        }
        if (goal.getCategoryId() == 0) {
            result.addErrorMessage("must choose a category", ResultType.INVALID);
        }
        if (goal.getType() == null || goal.getType().isBlank()){
            result.addErrorMessage("must indicate if this is a spending or saving goal", ResultType.INVALID);
        }
        if (goal.getAmount() == null || goal.getAmount().compareTo(BigDecimal.ZERO)<0) {
            result.addErrorMessage("Amount must be a positive number", ResultType.INVALID);
        }
        if (goal.getStartDate() == null) {
            result.addErrorMessage("start date is required", ResultType.INVALID);
        }
        if(goal.getEndDate() ==null){
            result.addErrorMessage("end date is required", ResultType.INVALID);
        }
//        if(goal.getAmount().compareTo(BigDecimal.ZERO)<0) {
//            result.addErrorMessage("Amount must be a positive number", ResultType.INVALID);
//        }
        if(goal.getStartDate().isBefore(LocalDate.now())){
            result.addErrorMessage("start date must be in the future", ResultType.INVALID);
        }
        if(goal.getEndDate().isBefore(goal.getStartDate())){
            result.addErrorMessage("end date cannot be before start date", ResultType.INVALID);
        }
        return result;
    }
}
