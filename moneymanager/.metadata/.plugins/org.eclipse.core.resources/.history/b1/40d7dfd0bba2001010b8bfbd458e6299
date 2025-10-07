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

import com.suraj.moneymanager.dto.IncomeDTO;
import com.suraj.moneymanager.service.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/income")
public class IncomeController {

  private final IncomeService incomeService;

    @PostMapping
  public ResponseEntity<IncomeDTO> addExpense(@RequestBody IncomeDTO expenseDTO) {
    IncomeDTO savedExpense = incomeService.addExpense(expenseDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
  }

   @GetMapping
  public ResponseEntity<List<IncomeDTO>> getExpenses(){
    List<IncomeDTO> expenses=incomeService.getCurrentMonthExpenseForCurrentUser();
    return ResponseEntity.status(HttpStatus.OK).body(expenses);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {

    incomeService.deleteIncome(id);
    return ResponseEntity.noContent().build();
    
  }
  
}
