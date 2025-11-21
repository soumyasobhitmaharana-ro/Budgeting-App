package com.soumya.moneymanager.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIPredictionResponse {
  private Long userId;
  private BigDecimal predictedExpenseNextMonth;
  private BigDecimal suggestedSavingGoal;
  private String trend; // UP | DOWN | STABLE
  private String confidence; // High | Medium | Low
  private String reason;
  private Map<String, String> categoryBreakdown; // e.g. Food -> "+8%"
  
  // New fields for charts
  private java.util.List<Double> monthlyExpenseHistory; // Last 6-12 months totals
  private Map<String, Double> categorySpending; // Category Name -> Total Amount (Last 3 months)
}
