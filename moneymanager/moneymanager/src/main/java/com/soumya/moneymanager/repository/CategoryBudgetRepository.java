package com.soumya.moneymanager.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soumya.moneymanager.entity.CategoryBudgetEntity;

public interface CategoryBudgetRepository extends JpaRepository<CategoryBudgetEntity, UUID> {
  
  // Find all budgets for a user and month
  List<CategoryBudgetEntity> findByUserIdAndMonth(Long userId, String month);
  
  // Find specific budget for user, category and month
  Optional<CategoryBudgetEntity> findByUserIdAndCategoryIdAndMonth(Long userId, Long categoryId, String month);
}
