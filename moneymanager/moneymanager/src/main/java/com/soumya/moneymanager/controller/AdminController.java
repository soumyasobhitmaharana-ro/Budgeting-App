package com.soumya.moneymanager.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

  private final AdminService adminService;

  @GetMapping("/users")
  public ResponseEntity<?> listUsers() {
    if (!adminService.isCurrentUserAdmin()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
    }
    List<ProfileEntity> users = adminService.listUsers();
    return ResponseEntity.ok(users);
  }

  @GetMapping("/categories")
  public ResponseEntity<?> listCategories() {
    if (!adminService.isCurrentUserAdmin()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
    }
    return ResponseEntity.ok(adminService.listCategories());
  }

  @GetMapping("/transactions/{userId}")
  public ResponseEntity<?> userTransactions(@PathVariable Long userId) {
    if (!adminService.isCurrentUserAdmin()) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Admin access required"));
    }
    return ResponseEntity.ok(adminService.transactionsForUser(userId));
  }
}
