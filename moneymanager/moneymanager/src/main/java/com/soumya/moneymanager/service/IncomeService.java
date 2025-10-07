package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.entity.CategoryEntity;
import com.soumya.moneymanager.entity.IncomeEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryRepo;
import com.soumya.moneymanager.repository.IncomeRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncomeService {

  private final CategoryRepo categoryRepo;
  private final ProfileService profileService;
  private final IncomeRepo incomeRepo;


  // Retrieve all income for the current month / based on the start date and end date

  public List<IncomeDTO> getCurrentMonthExpenseForCurrentUser()
  {
    ProfileEntity profile=profileService.getCurrentProfile();
    LocalDate now=LocalDate.now();
    LocalDate startDate=now.withDayOfMonth(1);
    LocalDate endDate=now.withDayOfMonth(now.lengthOfMonth());
    List<IncomeEntity> expenses=incomeRepo.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
    return expenses.stream().map(this::toDTO).toList();


  }


  private IncomeEntity toEntity(IncomeDTO dto,ProfileEntity profile,CategoryEntity category)
  {
    return IncomeEntity.builder()
        .id(dto.getId())
        .name(dto.getName())
        .icon(dto.getIcon())
        .amount(dto.getAmount())
        .date(dto.getDate())
        .category(category)
        .profile(profile)
        .build();
  }

  private IncomeDTO toDTO(IncomeEntity entity)
  {
    return IncomeDTO.builder()
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

  public IncomeDTO addExpense(IncomeDTO dto)
  {
      ProfileEntity profile=profileService.getCurrentProfile();
      CategoryEntity category=categoryRepo.findById(dto.getCategoryId()).orElseThrow(() -> new RuntimeException("Category not found"));
      IncomeEntity expense=toEntity(dto,profile,category);
      IncomeEntity savedExpense=incomeRepo.save(expense);
      return toDTO(savedExpense);

  }

   public void deleteIncome(Long id)
 {
   ProfileEntity  profile =profileService.getCurrentProfile();
    IncomeEntity income=incomeRepo.findById(id).orElseThrow(() -> new RuntimeException("Income not found"));
    if(!income.getProfile().getId().equals(profile.getId()))
    {
      throw new RuntimeException("Unauthorized to delete income");
    }
    incomeRepo.deleteById(id);
 }
  

  // Get Latest 5 incomes for current user

   public List<IncomeDTO> getLatest5ExpensesForCurrentUser()
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     List<IncomeEntity> income=incomeRepo.findTop5ByProfileIdOrderByDateDesc(profile.getId());
     return income.stream().map(this::toDTO).toList();
   }


   // Get total income for currenr user
   public BigDecimal getTotalIncomeForCurrentUser()
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     BigDecimal totalIncome=incomeRepo.findTotalIncomeByProfileId(profile.getId());
     return totalIncome!=null?totalIncome:BigDecimal.ZERO;
   }

   
   // Filter income
   public List<IncomeDTO> filterIncome(LocalDate startDate, LocalDate endDate,String keyword,Sort sort)
   {
     ProfileEntity profile=profileService.getCurrentProfile();
     List<IncomeEntity> incomes=incomeRepo.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword,sort);
     return incomes.stream().map(this::toDTO).toList();
   }
   
   public List<IncomeDTO> getAllIncomesForCurrentUser() {
	    ProfileEntity profile = profileService.getCurrentProfile();
	    List<IncomeEntity> incomes = incomeRepo.findByProfileId(profile.getId());
	    return incomes.stream().map(this::toDTO).toList();
	}

  
  
}
