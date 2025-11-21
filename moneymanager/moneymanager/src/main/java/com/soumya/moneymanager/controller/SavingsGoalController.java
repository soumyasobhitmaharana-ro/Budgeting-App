package com.soumya.moneymanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.SavingsGoalDTO;
import com.soumya.moneymanager.service.SavingsGoalService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/goals")
public class SavingsGoalController {

  private final SavingsGoalService savingsGoalService;

  /**
   * POST /api/v1/goals - Create or update a savings goal
   */
  @PostMapping
  public ResponseEntity<SavingsGoalDTO> createOrUpdateGoal(@RequestBody SavingsGoalDTO goalDTO) {
    SavingsGoalDTO savedGoal = savingsGoalService.createGoal(goalDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedGoal);
  }

  /**
   * GET /api/v1/goals?userId=... - Get all goals for user
   */
  @GetMapping
  public ResponseEntity<List<SavingsGoalDTO>> getGoals(
      @RequestParam(required = false) Long userId) {
    List<SavingsGoalDTO> goals = savingsGoalService.getGoalsByUser(userId);
    return ResponseEntity.ok(goals);
  }
}

