package com.suraj.moneymanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.suraj.moneymanager.dto.ExpenseDTO;
import com.suraj.moneymanager.service.ExpenseService;

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
  public ResponseEntity<List<ExpenseDTO>> getExpenses(){
    List<ExpenseDTO> expenses=expenseService.getCurrentMonthExpenseForCurrentUser();
    return ResponseEntity.status(HttpStatus.OK).body(expenses);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {

    expenseService.deleteExpense(id);
    return ResponseEntity.noContent().build();
    
  }
  
}
