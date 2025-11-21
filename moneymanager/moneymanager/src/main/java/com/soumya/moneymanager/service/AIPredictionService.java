package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.AIPredictionResponse;
import com.soumya.moneymanager.entity.CategoryEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryRepo;
import com.soumya.moneymanager.repository.ExpenseRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIPredictionService {
  private final ExpenseRepo expenseRepo;
  private final CategoryRepo categoryRepo;
  private final ProfileService profileService;

  public AIPredictionResponse getPredictionForUser(Long userId) {
    ProfileEntity current = profileService.getCurrentProfile();
    if (!current.getId().equals(userId)) {
      throw new RuntimeException("Unauthorized to access prediction for this user");
    }

    // Use ALL available history (e.g., last 24 months to be safe/performant, or ideally all)
    // For this implementation, let's use 12 months which is a good "full history" proxy for trends
    double[] monthly = lastNMonthsTotals(userId, 12);
    double slope = linearRegressionSlope(monthly);
    double variancePct = regressionVariancePercent(monthly, slope);

    // Predicted next month as last + slope
    double last = monthly[monthly.length - 1];
    double predicted = Math.max(0, last + slope);

    // Suggested saving goal = 20% of predicted (simple heuristic)
    double savingGoal = Math.max(0, predicted * 0.22);

    String trend = detectTrend(slope);
    String confidence = confidenceFromVariance(variancePct);

    // Category breakdown: Sum of last 3 months
    Map<String, Double> catSpending = categorySpendingLast3Months(userId);
    Map<String, String> categoryChange = formatCategoryBreakdown(catSpending);

    String reason = buildReason(trend, slope);

    // Convert double[] monthly to List<Double>
    List<Double> historyList = new java.util.ArrayList<>();
    for(double d : monthly) historyList.add(d);

    return AIPredictionResponse.builder()
        .userId(userId)
        .predictedExpenseNextMonth(BigDecimal.valueOf(predicted).setScale(0, RoundingMode.HALF_UP))
        .suggestedSavingGoal(BigDecimal.valueOf(savingGoal).setScale(0, RoundingMode.HALF_UP))
        .trend(trend)
        .confidence(confidence)
        .reason(reason)
        .categoryBreakdown(categoryChange)
        .monthlyExpenseHistory(historyList)
        .categorySpending(catSpending)
        .build();
  }

  private double[] lastNMonthsTotals(Long userId, int n) {
    double[] out = new double[n];
    YearMonth now = YearMonth.now();
    for (int i = n - 1; i >= 0; i--) {
      YearMonth ym = now.minusMonths(n - 1 - i);
      LocalDate start = ym.atDay(1);
      LocalDate end = ym.atEndOfMonth();
      var list = expenseRepo.findByProfileIdAndDateBetween(userId, start, end);
      double sum = list.stream().map(e -> e.getAmount() != null ? e.getAmount().doubleValue() : 0.0).reduce(0.0, Double::sum);
      out[i] = sum;
    }
    return out;
  }

  private double linearRegressionSlope(double[] values) {
    int n = values.length;
    if (n < 2) return 0.0;
    double sumX = 0;
    double sumY = 0;
    double sumXY = 0;
    double sumXX = 0;
    for (int i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumXX += i * i;
    }
    double denominator = (n * sumXX - sumX * sumX);
    if (denominator == 0) return 0.0;
    
    double slope = (n * sumXY - sumX * sumY) / denominator;
    return Double.isNaN(slope) ? 0.0 : slope;
  }

  private double regressionVariancePercent(double[] values, double slope) {
      int n = values.length;
      if (n < 2) return 0.0;
      
      // Calculate intercept
      double sumX = 0;
      double sumY = 0;
      for (int i = 0; i < n; i++) {
          sumX += i;
          sumY += values[i];
      }
      double intercept = (sumY - slope * sumX) / n;
      
      // Calculate residuals
      double sumSqResiduals = 0;
      double sumYVal = 0;
      for(int i=0; i<n; i++) {
          double predicted = slope * i + intercept;
          double actual = values[i];
          sumSqResiduals += Math.pow(actual - predicted, 2);
          sumYVal += actual;
      }
      
      double meanY = sumYVal / n;
      if (meanY == 0) return 0.0;
      
      // Normalize: RMSE / Mean * 100
      double mse = sumSqResiduals / n;
      double rmse = Math.sqrt(mse);
      
      double pct = (rmse / Math.abs(meanY)) * 100.0;
      return Math.min(100, pct);
  }

  private String detectTrend(double slope) {
      if (slope > 5) return "UP";
      if (slope < -5) return "DOWN";
      return "FLAT";
  }

  private String confidenceFromVariance(double variance) {
      if (variance < 10) return "High";
      if (variance < 30) return "Medium";
      return "Low";
  }

  private Map<String, Double> categorySpendingLast3Months(Long userId) {
    YearMonth now = YearMonth.now();
    LocalDate start = now.minusMonths(2).atDay(1); // Start of 3 months ago
    LocalDate end = now.atEndOfMonth(); // End of current month

    Map<String, Double> result = new HashMap<>();
    List<CategoryEntity> categories = categoryRepo.findAll();
    
    for (CategoryEntity c : categories) {
        BigDecimal sumBD = expenseRepo.findTotalExpenseByProfileIdAndCategoryIdAndDateBetween(userId, c.getId(), start, end);
        double sum = sumBD != null ? sumBD.doubleValue() : 0.0;
        if (sum > 0) {
            result.put(c.getName(), sum);
        }
    }
    return result;
  }

  private Map<String, String> formatCategoryBreakdown(Map<String, Double> catSpending) {
      Map<String, String> result = new HashMap<>();
      double total = catSpending.values().stream().mapToDouble(Double::doubleValue).sum();
      
      for (Map.Entry<String, Double> entry : catSpending.entrySet()) {
          if (total == 0) {
              result.put(entry.getKey(), "0%");
          } else {
              double pct = (entry.getValue() / total) * 100.0;
              result.put(entry.getKey(), String.format("%.1f%%", pct));
          }
      }
      return result;
  }

  private String buildReason(String trend, double slope) {
    if ("UP".equals(trend)) return "Expenses increased for 2 consecutive months. Regression line is upward sloping.";
    if ("DOWN".equals(trend)) return "Expenses decreased recently. Regression line is downward sloping.";
    return "Expenses are relatively stable month over month.";
  }
}
