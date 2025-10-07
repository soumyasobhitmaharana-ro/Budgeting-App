package com.suraj.moneymanager.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.suraj.moneymanager.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashBoardController {

  private final DashboardService dashboardService;

  @GetMapping
  public ResponseEntity<Map<String,Object>> getDashboardData(){
    Map<String,Object> response=dashboardService.getDashboardData();
    return ResponseEntity.ok(response);
  }

  // 4:33
  
}
