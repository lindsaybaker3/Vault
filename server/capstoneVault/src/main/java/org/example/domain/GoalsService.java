package org.example.domain;

import org.example.data.BudgetCategoryRepository;
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
    private final BudgetCategoryRepository budgetRepository;

    public GoalsService(GoalsJdbcTemplateRepository repository, TransactionsJdbcTemplateRepository transactionRepository, BudgetCategoryRepository budgetRepository) {
        this.repository = repository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
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
        boolean hasTransactions = transactionRepository.hasTransactions(id);
        if(hasTransactions){
            result.addErrorMessage("This goal has transactions in it: cannot be deleted", ResultType.INVALID);
        } else{
            repository.deleteById(id);
            if(!result.isSuccess()){
                result.addErrorMessage("Goal id %s was not found", ResultType.NOT_FOUND, id);
            }
        }

        return result;
    }

    private Result validate(Goals goal) throws DataAccessException {
        Result result = new Result();

        if(goal == null) {
            result.addErrorMessage("Goal cannot be null", ResultType.INVALID);
            return result;
        }
        if (goal.getCategoryId() == 0 || budgetRepository.findByCategoryId(goal.getCategoryId()) == null) {
            result.addErrorMessage("must choose a valid category", ResultType.INVALID);
        }
        if (goal.getType() == null || goal.getType().isBlank()){
            result.addErrorMessage("must indicate if this is a spending or saving goal", ResultType.INVALID);
        }
        if (goal.getAmount() == null || goal.getAmount().compareTo(BigDecimal.ZERO)<0) {
            result.addErrorMessage("Amount must be a positive number", ResultType.INVALID);
        }
        if (goal.getStartDate() == null || goal.getStartDate().isBefore(LocalDate.now())) {
            result.addErrorMessage("start date must be in the future", ResultType.INVALID);
        }
        if(goal.getStartDate() != null && (goal.getEndDate() ==null || goal.getEndDate().isBefore(goal.getStartDate()))){
            result.addErrorMessage("end date cannot be before start date", ResultType.INVALID);
        }
        if(!(repository.findByUserId(goal.getAppUserId()).stream().anyMatch(c -> c.isCategoryAllowed(goal)))){
            result.addErrorMessage("A goal with that category is already in use", ResultType.INVALID);
        }//cat and id does not match and startdate and enddate overlaps existing that has the same catId
        //move check into model class
        //validate that the category does exist

        return result;
    }
}
