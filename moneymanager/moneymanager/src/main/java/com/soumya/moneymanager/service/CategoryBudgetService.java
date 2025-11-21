package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.CategoryBudgetDTO;
import com.soumya.moneymanager.entity.CategoryBudgetEntity;
import com.soumya.moneymanager.entity.CategoryEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryBudgetRepository;
import com.soumya.moneymanager.repository.CategoryRepo;
import com.soumya.moneymanager.repository.ExpenseRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryBudgetService {

  private final CategoryBudgetRepository categoryBudgetRepository;
  private final CategoryRepo categoryRepo;
  private final ExpenseRepo expenseRepo;
  private final ProfileService profileService;

  private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

  /**
   * Create or update a category budget
   */
  public CategoryBudgetDTO createOrUpdateBudget(CategoryBudgetDTO budgetDTO) {
    ProfileEntity profile = profileService.getCurrentProfile();
    Long userId = profile.getId();

    // Validate month format (YYYY-MM)
    validateMonthFormat(budgetDTO.getMonth());

    // Validate category exists and belongs to user
    CategoryEntity category = categoryRepo.findByIdAndProfileId(budgetDTO.getCategoryId(), userId)
        .orElseThrow(() -> new RuntimeException("Category not found"));

    // Check if budget already exists
    Optional<CategoryBudgetEntity> existingBudget = categoryBudgetRepository
        .findByUserIdAndCategoryIdAndMonth(userId, budgetDTO.getCategoryId(), budgetDTO.getMonth());

    CategoryBudgetEntity budgetEntity;
    if (existingBudget.isPresent()) {
      // Update existing budget
      budgetEntity = existingBudget.get();
      budgetEntity.setBudgetAmount(budgetDTO.getBudgetAmount());
    } else {
      // Create new budget
      budgetEntity = CategoryBudgetEntity.builder()
          .userId(userId)
          .categoryId(budgetDTO.getCategoryId())
          .month(budgetDTO.getMonth())
          .budgetAmount(budgetDTO.getBudgetAmount())
          .build();
    }

    CategoryBudgetEntity savedBudget = categoryBudgetRepository.save(budgetEntity);
    return toDTO(savedBudget, category.getName());
  }

  /**
   * Get all budgets for a user and month
   * Computes spent amount, remaining, and status for each budget
   */
  public List<CategoryBudgetDTO> getBudgetsForMonth(String month, Long userId) {
    ProfileEntity currentProfile = profileService.getCurrentProfile();
    
    // Use provided userId or current user's id
    Long targetUserId = (userId != null) ? userId : currentProfile.getId();
    
    // Validate that user can only access their own budgets (or admin logic can be added here)
    if (!targetUserId.equals(currentProfile.getId())) {
      throw new RuntimeException("Unauthorized to access budgets for this user");
    }

    validateMonthFormat(month);

    // Parse month to get start and end dates
    YearMonth yearMonth = YearMonth.parse(month, MONTH_FORMATTER);
    LocalDate startDate = yearMonth.atDay(1);
    LocalDate endDate = yearMonth.atEndOfMonth();

    // Get all budgets for user and month
    List<CategoryBudgetEntity> budgets = categoryBudgetRepository.findByUserIdAndMonth(targetUserId, month);

    // Convert to DTOs and compute spent amounts
    return budgets.stream().map(budget -> {
      CategoryEntity category = categoryRepo.findById(budget.getCategoryId())
          .orElseThrow(() -> new RuntimeException("Category not found for budget"));

      // Compute spent amount using existing expense repository
      BigDecimal spentBigDecimal = expenseRepo.findTotalExpenseByProfileIdAndCategoryIdAndDateBetween(
          budget.getUserId(), budget.getCategoryId(), startDate, endDate);
      
      double spentAmount = (spentBigDecimal != null) ? spentBigDecimal.doubleValue() : 0.0;
      double remaining = budget.getBudgetAmount() - spentAmount;
      String status = (spentAmount <= budget.getBudgetAmount()) ? "WITHIN" : "EXCEEDED";

      return CategoryBudgetDTO.builder()
          .id(budget.getId())
          .userId(budget.getUserId())
          .categoryId(budget.getCategoryId())
          .categoryName(category.getName())
          .month(budget.getMonth())
          .budgetAmount(budget.getBudgetAmount())
          .spentAmount(spentAmount)
          .remaining(remaining)
          .status(status)
          .createdAt(budget.getCreatedAt())
          .updatedAt(budget.getUpdatedAt())
          .build();
    }).toList();
  }

  /**
   * Convert entity to DTO with computed values
   */
  private CategoryBudgetDTO toDTO(CategoryBudgetEntity entity, String categoryName) {
    // For create/update, we don't compute spent here - client will fetch to see spent
    return CategoryBudgetDTO.builder()
        .id(entity.getId())
        .userId(entity.getUserId())
        .categoryId(entity.getCategoryId())
        .categoryName(categoryName)
        .month(entity.getMonth())
        .budgetAmount(entity.getBudgetAmount())
        .spentAmount(0.0) // Will be computed when fetched via getBudgetsForMonth
        .remaining(entity.getBudgetAmount())
        .status("WITHIN")
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }

  /**
   * Validate month format (YYYY-MM)
   */
  private void validateMonthFormat(String month) {
    try {
      YearMonth.parse(month, MONTH_FORMATTER);
    } catch (Exception e) {
      throw new RuntimeException("Invalid month format. Expected YYYY-MM, got: " + month);
    }
  }
}
