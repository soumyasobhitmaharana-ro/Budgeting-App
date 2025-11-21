package com.soumya.moneymanager.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.ExpenseDTO;
import com.soumya.moneymanager.service.ExpenseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

  private final ExpenseService expenseService;

  @PostMapping
  public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseDTO expenseDTO) {
    ExpenseDTO savedExpense = expenseService.addExpense(expenseDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
  }

  @GetMapping
  public ResponseEntity<List<ExpenseDTO>> getExpenses(
      @RequestParam(required = false) LocalDate startDate,
      @RequestParam(required = false) LocalDate endDate
  ){
    List<ExpenseDTO> expenses=expenseService.getExpensesForDateRange(startDate, endDate);
    return ResponseEntity.status(HttpStatus.OK).body(expenses);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
 
    expenseService.deleteExpense(id);
    return ResponseEntity.noContent().build();
    
  }
  @PutMapping("/{id}")
public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDTO) {
    ExpenseDTO updatedExpense = expenseService.updateExpense(id, expenseDTO);
    return ResponseEntity.ok(updatedExpense);
}

@GetMapping("/{id}")
public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
    ExpenseDTO expense = expenseService.getExpenseById(id);
    return ResponseEntity.ok(expense);
}
  
}