package org.example.domain;

import org.example.data.BudgetCategoryRepository;
import org.example.models.BudgetCategory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetCategoryService {
    private final BudgetCategoryRepository budgetCategoryRepository;


    public BudgetCategoryService(BudgetCategoryRepository budgetCategoryRepository) {
        this.budgetCategoryRepository = budgetCategoryRepository;
    }

    public List<BudgetCategory> findAll() {
        return budgetCategoryRepository.findAll();
    }

    public BudgetCategory findByCategoryId(int categoryId){
        BudgetCategory budgetCategory = budgetCategoryRepository.findByCategoryId((categoryId));

        return budgetCategory;
    }
}
