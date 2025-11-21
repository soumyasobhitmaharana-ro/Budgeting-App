package com.soumya.moneymanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.CategoryBudgetDTO;
import com.soumya.moneymanager.service.CategoryBudgetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/budget")
public class BudgetController {

  private final CategoryBudgetService categoryBudgetService;

  /**
   * POST /api/budget - Create or update a category budget
   */
  @PostMapping
  public ResponseEntity<CategoryBudgetDTO> createOrUpdateBudget(@RequestBody CategoryBudgetDTO budgetDTO) {
    CategoryBudgetDTO savedBudget = categoryBudgetService.createOrUpdateBudget(budgetDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedBudget);
  }

  /**
   * GET /api/budget?month=YYYY-MM&userId= - Get all budgets for user and month
   */
  @GetMapping
  public ResponseEntity<List<CategoryBudgetDTO>> getBudgets(
      @RequestParam String month,
      @RequestParam(required = false) Long userId) {
    List<CategoryBudgetDTO> budgets = categoryBudgetService.getBudgetsForMonth(month, userId);
    return ResponseEntity.ok(budgets);
  }
}
