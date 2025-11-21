package com.soumya.moneymanager.controller;

import java.util.Map;
import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashBoardController {

  private final DashboardService dashboardService;

  @GetMapping
  public ResponseEntity<Map<String,Object>> getDashboardData(
      @org.springframework.web.bind.annotation.RequestParam(required = false) java.time.LocalDate startDate,
      @org.springframework.web.bind.annotation.RequestParam(required = false) java.time.LocalDate endDate
  ){
    Map<String,Object> response=dashboardService.getDashboardData(startDate, endDate);
    return ResponseEntity.ok(response);
  }

  // 4:33
  
}
