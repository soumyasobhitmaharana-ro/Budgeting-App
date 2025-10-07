package com.suraj.moneymanager.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import static java.util.stream.Stream.concat;

import org.springframework.stereotype.Service;

import com.suraj.moneymanager.dto.ExpenseDTO;
import com.suraj.moneymanager.dto.IncomeDTO;
import com.suraj.moneymanager.dto.RecentTransactionDTO;
import com.suraj.moneymanager.entity.ProfileEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
  private final IncomeService incomeService;
  private final ExpenseService expenseService;
  private final ProfileService profileService;

  public Map<String ,Object> getDashboardData()

  {
    ProfileEntity profile=profileService.getCurrentProfile();
    Map<String,Object>  returnValue = new LinkedHashMap<>();
    List<IncomeDTO> latestExpenses=incomeService.getLatest5ExpensesForCurrentUser();
    List<ExpenseDTO> latestIncomes=expenseService.getLatest5ExpensesForCurrentUser();
    List<RecentTransactionDTO> recentTransactions=concat(latestIncomes.stream().map((ExpenseDTO income) -> 
                   RecentTransactionDTO.builder()
                   .id(income.getId())
                   .profileId(profile.getId())
                   .icon(income.getIcon())
                   .name(income.getName())
                   .type("Income")
                   .amount(income.getAmount())
                   .date(income.getDate())
                   .createdAt(income.getCreatedAt())
                   .updatedAt(income.getUpdatedAt())
                   .build()
                   ),latestExpenses.stream().map(expense -> 
                   RecentTransactionDTO.builder()
                   .id(expense.getId())
                   .profileId(profile.getId())
                   .icon(expense.getIcon())
                   .name(expense.getName())
                   .type("Expense")
                   .amount(expense.getAmount())
                   .date(expense.getDate())
                   .createdAt(expense.getCreatedAt())
                   .build()
                   ))
                   .sorted((a,b) -> {
                     int cmp = b.getDate().compareTo(a.getDate());
                     if(cmp==0 && a.getCreatedAt()!=null && b.getCreatedAt()!=null)
                     {
                       return b.getCreatedAt().compareTo(a.getCreatedAt());
                     }
                     return cmp;
                   }).collect(Collectors.toList());

                   returnValue.put("totalBalance",incomeService.getTotalIncomeForCurrentUser().subtract(expenseService.getTotalExpenseForCurrentUser()));

                   returnValue.put("totalIncome",incomeService.getTotalIncomeForCurrentUser());
                   returnValue.put("totalExpense",expenseService.getTotalExpenseForCurrentUser());
                   returnValue.put("recent5Expenses",latestExpenses);
                   returnValue.put("recent5Incomes",latestIncomes);
                   returnValue.put("recentTransactions",recentTransactions);
                   return returnValue;

  }
}
