package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import static java.util.stream.Stream.concat;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.ExpenseDTO;
import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.dto.RecentTransactionDTO;
import com.soumya.moneymanager.entity.ProfileEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
  private final IncomeService incomeService;
  private final ExpenseService expenseService;
  private final ProfileService profileService;

  public Map<String, Object> getDashboardData(LocalDate startDate, LocalDate endDate) {
    ProfileEntity profile = profileService.getCurrentProfile();
    Map<String, Object> returnValue = new LinkedHashMap<>();

    // 1. Fetch data for the requested range (for totals and recent transactions)
    List<IncomeDTO> rangeIncomes = incomeService.getIncomesForDateRange(startDate, endDate);
    List<ExpenseDTO> rangeExpenses = expenseService.getExpensesForDateRange(startDate, endDate);

    BigDecimal totalIncome = rangeIncomes.stream()
        .map(IncomeDTO::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal totalExpense = rangeExpenses.stream()
        .map(ExpenseDTO::getAmount)
        .reduce(BigDecimal.ZERO, BigDecimal::add);

    returnValue.put("totalBalance", totalIncome.subtract(totalExpense));
    returnValue.put("totalIncome", totalIncome);
    returnValue.put("totalExpense", totalExpense);

    // 2. Recent Transactions (Merged & Sorted)
    List<RecentTransactionDTO> recentTransactions = concat(
        rangeIncomes.stream().map(income -> RecentTransactionDTO.builder()
            .id(income.getId())
            .profileId(profile.getId())
            .icon(income.getIcon())
            .name(income.getName())
            .type("Income")
            .amount(income.getAmount())
            .date(income.getDate())
            .createdAt(income.getCreatedAt())
            .updatedAt(income.getUpdatedAt())
            .build()),
        rangeExpenses.stream().map(expense -> RecentTransactionDTO.builder()
            .id(expense.getId())
            .profileId(profile.getId())
            .icon(expense.getIcon())
            .name(expense.getName())
            .type("Expense")
            .amount(expense.getAmount())
            .date(expense.getDate())
            .createdAt(expense.getCreatedAt())
            .updatedAt(expense.getUpdatedAt())
            .build()))
        .sorted((a, b) -> {
          int cmp = b.getDate().compareTo(a.getDate());
          if (cmp == 0 && a.getCreatedAt() != null && b.getCreatedAt() != null) {
            return b.getCreatedAt().compareTo(a.getCreatedAt());
          }
          return cmp;
        }).collect(Collectors.toList());

    returnValue.put("recentTransactions", recentTransactions.stream().limit(10).toList());
    returnValue.put("recent5Expenses", rangeExpenses.stream().sorted((a,b)->b.getDate().compareTo(a.getDate())).limit(5).toList());
    returnValue.put("recent5Incomes", rangeIncomes.stream().sorted((a,b)->b.getDate().compareTo(a.getDate())).limit(5).toList());

    // 3. Last Month Stats (for comparison)
    LocalDate now = LocalDate.now();
    LocalDate lastMonthStart = now.minusMonths(1).withDayOfMonth(1);
    LocalDate lastMonthEnd = now.minusMonths(1).withDayOfMonth(lastMonthStart.lengthOfMonth());
    
    List<IncomeDTO> lastMonthIncomes = incomeService.getIncomesForDateRange(lastMonthStart, lastMonthEnd);
    List<ExpenseDTO> lastMonthExpenses = expenseService.getExpensesForDateRange(lastMonthStart, lastMonthEnd);

    BigDecimal lastMonthIncomeTotal = lastMonthIncomes.stream().map(IncomeDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal lastMonthExpenseTotal = lastMonthExpenses.stream().map(ExpenseDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

    returnValue.put("lastMonthIncome", lastMonthIncomeTotal);
    returnValue.put("lastMonthExpense", lastMonthExpenseTotal);

    // 4. Trend & Change Percentage (Current Month vs Last Month - approximate if range is not month-aligned, but useful)
    // If specific range is selected, we compare that range total to last month? 
    // Better: Compare "Current Month" (or selected range if it's a month) vs Last Month.
    // For simplicity/robustness: Compare the *Last 30 Days* or *Current Month* vs *Previous Month*.
    // Let's use the totals we just calculated for the requested range vs last month? 
    // The requirement says "changePercentage". Let's assume it means "Current Month vs Last Month" regardless of filter, 
    // OR "Selected Range vs Previous Period". 
    // Given the UI usually shows "vs last month", let's compute Current Month vs Last Month explicitly for the stats cards.
    
    LocalDate thisMonthStart = now.withDayOfMonth(1);
    LocalDate thisMonthEnd = now.withDayOfMonth(now.lengthOfMonth());
    List<ExpenseDTO> thisMonthExpenses = expenseService.getExpensesForDateRange(thisMonthStart, thisMonthEnd);
    BigDecimal thisMonthExpenseTotal = thisMonthExpenses.stream().map(ExpenseDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

    double prevExp = lastMonthExpenseTotal.doubleValue();
    double currExp = thisMonthExpenseTotal.doubleValue();
    double changePct = prevExp == 0 ? (currExp > 0 ? 100.0 : 0.0) : ((currExp - prevExp) / prevExp) * 100.0;
    
    returnValue.put("changePercentage", BigDecimal.valueOf(changePct).setScale(1, java.math.RoundingMode.HALF_UP));
    returnValue.put("trendDirection", changePct > 0 ? "UP" : (changePct < 0 ? "DOWN" : "FLAT"));

    // 5. History (Last 6 Months)
    // We need a list of {month: "Jan", income: 1000, expense: 500}
    List<Map<String, Object>> history = new java.util.ArrayList<>();
    for (int i = 5; i >= 0; i--) {
        java.time.YearMonth ym = java.time.YearMonth.now().minusMonths(i);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();
        
        List<IncomeDTO> mIncomes = incomeService.getIncomesForDateRange(start, end);
        List<ExpenseDTO> mExpenses = expenseService.getExpensesForDateRange(start, end);
        
        BigDecimal mInc = mIncomes.stream().map(IncomeDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal mExp = mExpenses.stream().map(ExpenseDTO::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Map<String, Object> monthData = new LinkedHashMap<>();
        monthData.put("month", ym.getMonth().name().substring(0, 3)); // Jan, Feb
        monthData.put("income", mInc);
        monthData.put("expense", mExp);
        history.add(monthData);
    }
    returnValue.put("history", history);

    return returnValue;
  }
}