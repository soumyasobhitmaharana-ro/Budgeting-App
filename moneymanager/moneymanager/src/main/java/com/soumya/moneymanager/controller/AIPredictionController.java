package com.soumya.moneymanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.AIPredictionResponse;
import com.soumya.moneymanager.service.AIPredictionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard/ai-prediction")
@RequiredArgsConstructor
public class AIPredictionController {

  private final AIPredictionService aiPredictionService;

  @GetMapping("/{userId}")
  public ResponseEntity<AIPredictionResponse> getAIPrediction(@PathVariable Long userId) {
    AIPredictionResponse resp = aiPredictionService.getPredictionForUser(userId);
    return ResponseEntity.ok(resp);
  }
}
