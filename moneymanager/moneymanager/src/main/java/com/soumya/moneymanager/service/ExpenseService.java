package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.ExpenseDTO;
import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.entity.CategoryEntity;
import com.soumya.moneymanager.entity.ExpenseEntity;
import com.soumya.moneymanager.entity.IncomeEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryRepo;
import com.soumya.moneymanager.repository.ExpenseRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {

  private final CategoryRepo categoryRepo;
  private final ExpenseRepo expenseRepo;

  private final ProfileService profileService;



  // Retrieve all expenses for the current month / based on the start date and end date

  // Retrieve expenses for a specific date range
  public List<ExpenseDTO> getExpensesForDateRange(LocalDate startDate, LocalDate endDate) {
    ProfileEntity profile = profileService.getCurrentProfile();
    List<ExpenseEntity> expenses;

    if (startDate != null && endDate != null) {
        expenses = expenseRepo.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
    } else {
        // Return all expenses if no range specified
        expenses = expenseRepo.findByProfileId(profile.getId());
    }
    return expenses.stream().map(this::toDTO).toList();
  }

  private ExpenseEntity toEntity(ExpenseDTO dto,ProfileEntity profile,CategoryEntity category)
  {
    return ExpenseEntity.builder()
        .id(dto.getId())
        .name(dto.getName())
        .icon(dto.getIcon())
        .amount(dto.getAmount())
        .date(dto.getDate())
        .category(category)
        .profile(profile)
        .build();
  }

  private ExpenseDTO toDTO(ExpenseEntity entity)
  {
    return ExpenseDTO.builder()
        .id(entity.getId())
        .name(entity.getName())
        .icon(entity.getIcon())
        .categoryName(entity.getCategory()!=null?entity.getCategory().getName():null)
        .categoryId(entity.getCategory()!=null?entity.getCategory().getId():null)
        .amount(entity.getAmount())
        .date(entity.getDate())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }


  public ExpenseDTO addExpense(ExpenseDTO dto)
  {
      ProfileEntity profile=profileService.getCurrentProfile();
      CategoryEntity category=categoryRepo.findById(dto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
      ExpenseEntity expense=toEntity(dto,profile,category);
      ExpenseEntity savedExpense=expenseRepo.save(expense);
      return toDTO(savedExpense);

  }

 // delete expense by id for current user
 public void deleteExpense(Long id)
 {
   ProfileEntity  profile =profileService.getCurrentProfile();
    ExpenseEntity expense=expenseRepo.findById(id).orElseThrow(() -> new RuntimeException("Expense not found"));
    if(!expense.getProfile().getId().equals(profile.getId()))
    {
      throw new RuntimeException("Unauthorized to delete expense");
    }
    expenseRepo.deleteById(id);
 }

 // Get Latest 5 expenses for current user


   public List<ExpenseDTO> getLatest5ExpensesForCurrentUser()
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     List<ExpenseEntity> expenses=expenseRepo.findTop5ByProfileIdOrderByDateDesc(profile.getId());
     return expenses.stream().map(this::toDTO).toList();
   }


   // Get total expense for currenr user
   public BigDecimal getTotalExpenseForCurrentUser()
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     BigDecimal totalExpense=expenseRepo.findTotalExpenseByProfileId(profile.getId());
     return totalExpense!=null?totalExpense:BigDecimal.ZERO;
   }

   // Filter expenses
   public List<ExpenseDTO> filterExpenses(LocalDate startDate, LocalDate endDate,String keyword,Sort sort)
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     List<ExpenseEntity> expenses=expenseRepo.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword,sort);
     return expenses.stream().map(this::toDTO).toList();
   }

   // Notification

   public List<ExpenseDTO> getExpenseForUserOnDate(Long profileId,LocalDate date)
   {
      List<ExpenseEntity> expenses=expenseRepo.findByProfileIdAndDate(profileId,date);
      return expenses.stream().map(this::toDTO).toList();
   }
   
   public List<ExpenseDTO> getAllExpenseForCurrentUser() {
	    ProfileEntity profile = profileService.getCurrentProfile();
	    List<ExpenseEntity> expense = expenseRepo.findByProfileId(profile.getId());
	    return expense.stream().map(this::toDTO).toList();
	}
  public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
    ProfileEntity profile = profileService.getCurrentProfile();
    ExpenseEntity existingExpense = expenseRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    
    if (!existingExpense.getProfile().getId().equals(profile.getId())) {
        throw new RuntimeException("Unauthorized to update expense");
    }
    
    CategoryEntity category = categoryRepo.findById(expenseDTO.getCategoryId())
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + expenseDTO.getCategoryId()));
    
    existingExpense.setName(expenseDTO.getName());
    existingExpense.setAmount(expenseDTO.getAmount());
    existingExpense.setDate(expenseDTO.getDate());
    existingExpense.setCategory(category);
    existingExpense.setIcon(expenseDTO.getIcon());
    
    ExpenseEntity updatedExpense = expenseRepo.save(existingExpense);
    return toDTO(updatedExpense);
}

public ExpenseDTO getExpenseById(Long id) {
    ProfileEntity profile = profileService.getCurrentProfile();
    ExpenseEntity expense = expenseRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Expense not found with id: " + id));
    
    if (!expense.getProfile().getId().equals(profile.getId())) {
        throw new RuntimeException("Unauthorized to access this expense");
    }
    
    return toDTO(expense);
}
  
}