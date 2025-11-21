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

  // Retrieve incomes for a specific date range (or all time if null)
  public List<IncomeDTO> getIncomesForDateRange(LocalDate startDate, LocalDate endDate) {
    ProfileEntity profile = profileService.getCurrentProfile();
    List<IncomeEntity> incomes;
    
    if (startDate != null && endDate != null) {
        incomes = incomeRepo.findByProfileIdAndDateBetween(profile.getId(), startDate, endDate);
    } else {
        // If no dates provided, return ALL incomes (or default to a wide range if preferred, but user asked for history)
        // For now, let's return all incomes to ensure history is visible by default if no filter is applied
        incomes = incomeRepo.findByProfileId(profile.getId());
    }
    return incomes.stream().map(this::toDTO).toList();
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

   public List<IncomeDTO> getLatest5IncomesForCurrentUser()
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

  public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
    ProfileEntity profile = profileService.getCurrentProfile();
    IncomeEntity existingIncome = incomeRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));
    
    if (!existingIncome.getProfile().getId().equals(profile.getId())) {
        throw new RuntimeException("Unauthorized to update income");
    }
    
    CategoryEntity category = categoryRepo.findById(incomeDTO.getCategoryId())
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + incomeDTO.getCategoryId()));
    
    existingIncome.setName(incomeDTO.getName());
    existingIncome.setAmount(incomeDTO.getAmount());
    existingIncome.setDate(incomeDTO.getDate());
    existingIncome.setCategory(category);
    existingIncome.setIcon(incomeDTO.getIcon());
    
    IncomeEntity updatedIncome = incomeRepo.save(existingIncome);
    return toDTO(updatedIncome);
}

public IncomeDTO getIncomeById(Long id) {
    ProfileEntity profile = profileService.getCurrentProfile();
    IncomeEntity income = incomeRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Income not found with id: " + id));
    
    if (!income.getProfile().getId().equals(profile.getId())) {
        throw new RuntimeException("Unauthorized to access this income");
    }
    
    return toDTO(income);
}
  
}