package org.example.controllers;

import org.example.domain.BudgetCategoryService;
import org.example.models.BudgetCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
@CrossOrigin
public class BudgetCategoryController {

    private final BudgetCategoryService service;

    @Autowired
    public BudgetCategoryController(BudgetCategoryService service) {
        this.service = service;
    }

    @GetMapping("/budget-category/all")
    public List<BudgetCategory> findAllBudgetCategories(){
        return service.findAll();
    }

    @GetMapping("/budget-category/{categoryId}")
    public ResponseEntity<BudgetCategory> findByBudgetCategoryId(@PathVariable int categoryId){
        BudgetCategory category = service.findByCategoryId(categoryId);
        if (category == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(category, HttpStatus.OK);

    }

}
