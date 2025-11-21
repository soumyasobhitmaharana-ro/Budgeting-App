package com.soumya.moneymanager.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryBudgetDTO {

  private UUID id;
  private Long userId;
  private Long categoryId;
  private String categoryName;
  private String month; // Format: YYYY-MM
  private Double budgetAmount;
  private Double spentAmount;
  private Double remaining;
  private String status; // "WITHIN" or "EXCEEDED"
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
