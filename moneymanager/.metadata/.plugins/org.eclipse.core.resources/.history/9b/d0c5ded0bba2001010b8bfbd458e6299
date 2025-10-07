package com.suraj.moneymanager.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.suraj.moneymanager.dto.ExpenseDTO;
import com.suraj.moneymanager.dto.FilterDTO;
import com.suraj.moneymanager.dto.IncomeDTO;
import com.suraj.moneymanager.service.ExpenseService;
import com.suraj.moneymanager.service.IncomeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/filter")
@RequiredArgsConstructor
public class FilterController {


  private final ExpenseService expenseService;
  private final IncomeService incomeService;

  @PostMapping
  public ResponseEntity<?> filterTransaction(@RequestBody FilterDTO filter)
  {
    // Preparing the data or validation
    LocalDate starDate=filter.getStartDate() !=null ? filter.getStartDate() : LocalDate.MIN;
    LocalDate endDate=filter.getEndDate() !=null ? filter.getEndDate() : LocalDate.now();
     String keyword=filter.getKeyword()!=null ? filter.getKeyword() : "";
     String sortFIeld=filter.getSortField()!=null ? filter.getSortField() : "date";
     Sort.Direction direction  = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
     Sort sort = Sort.by(direction,sortFIeld);
     if("income".equalsIgnoreCase(filter.getType()))
     {
       List<IncomeDTO> incomes=incomeService.filterIncome(starDate, endDate, keyword, sort);
       return ResponseEntity.ok(incomes);
     }
     else if("expense".equalsIgnoreCase(filter.getType()))
     {
       List<ExpenseDTO> expenses=expenseService.filterExpenses(starDate, endDate, keyword, sort);
       return ResponseEntity.ok(expenses);
     }
     else
     {
       return ResponseEntity.badRequest().body("Invalid type.Must be expense or income");
     }
  }
  
}
