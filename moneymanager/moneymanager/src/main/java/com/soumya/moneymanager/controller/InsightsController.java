package com.soumya.moneymanager.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.AIPredictionResponse;
import com.soumya.moneymanager.service.AIPredictionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/insights")
@RequiredArgsConstructor
public class InsightsController {

  private final AIPredictionService aiPredictionService;

  @GetMapping("/predict-budget/{userId}")
  public ResponseEntity<Map<String, Object>> predictBudget(@PathVariable("userId") Long userId) {
    AIPredictionResponse r = aiPredictionService.getPredictionForUser(userId);

    Map<String, Object> resp = new HashMap<>();
    resp.put("userId", r.getUserId());
    resp.put("predictedExpense", r.getPredictedExpenseNextMonth() != null ? r.getPredictedExpenseNextMonth().longValue() : 0L);
    resp.put("suggestedSavingGoal", r.getSuggestedSavingGoal() != null ? r.getSuggestedSavingGoal().longValue() : 0L);
    resp.put("trend", r.getTrend() != null ? r.getTrend().toUpperCase() : "STABLE");
    resp.put("confidence", r.getConfidence() != null ? r.getConfidence().toUpperCase() : "LOW");

    Map<String, Number> shifts = new HashMap<>();
    if (r.getCategoryBreakdown() != null) {
      for (Map.Entry<String, String> e : r.getCategoryBreakdown().entrySet()) {
        String v = e.getValue();
        if (v == null) continue;
        String digits = v.replace("%", "").replace("+", "").replace("-", "").trim();
        try {
          shifts.put(e.getKey(), Integer.parseInt(digits));
        } catch (NumberFormatException ex) {
        }
      }
    }
    resp.put("shifts", shifts);

    List<String> notes = new ArrayList<>();
    if (r.getReason() != null && !r.getReason().isBlank()) notes.add(r.getReason());
    notes.add("Trend is " + (r.getTrend() != null ? r.getTrend().toUpperCase() : "STABLE"));
    resp.put("notes", notes);

    return ResponseEntity.ok(resp);
  }
}
