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

import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.service.IncomeService;

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
  public ResponseEntity<List<IncomeDTO>> getIncomes(
      @RequestParam(required = false) LocalDate startDate,
      @RequestParam(required = false) LocalDate endDate
  ){
    List<IncomeDTO> incomes=incomeService.getIncomesForDateRange(startDate, endDate);
    return ResponseEntity.status(HttpStatus.OK).body(incomes);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteIncome(@PathVariable Long id) {

    incomeService.deleteIncome(id);
    return ResponseEntity.noContent().build();
    
  }
  @PutMapping("/{id}")
public ResponseEntity<IncomeDTO> updateIncome(@PathVariable Long id, @RequestBody IncomeDTO incomeDTO) {
    IncomeDTO updatedIncome = incomeService.updateIncome(id, incomeDTO);
    return ResponseEntity.ok(updatedIncome);
}

@GetMapping("/{id}")
public ResponseEntity<IncomeDTO> getIncomeById(@PathVariable Long id) {
    IncomeDTO income = incomeService.getIncomeById(id);
    return ResponseEntity.ok(income);
}
  
}