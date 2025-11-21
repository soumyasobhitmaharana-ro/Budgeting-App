package com.soumya.moneymanager.dto;

import java.time.LocalDate;
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
public class SavingsGoalDTO {

  private UUID id;
  private Long userId;
  private String goalName;
  private Double targetAmount;
  private Double savedAmount;
  private LocalDate deadline;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}

