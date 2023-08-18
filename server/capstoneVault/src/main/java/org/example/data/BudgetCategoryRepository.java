package org.example.data;

import org.example.models.BudgetCategory;

import java.util.List;

public interface BudgetCategoryRepository {
    List<BudgetCategory> findAll();

    List<BudgetCategory> findByGoalType(String type);

    BudgetCategory findByCategoryId(int categoryId);
}
