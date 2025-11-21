package com.soumya.moneymanager.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.service.BackupService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/backup")
@RequiredArgsConstructor
public class BackupController {

  private final BackupService backupService;

  @GetMapping("/google-drive/{userId}")
  public ResponseEntity<Map<String, Object>> backupGoogle(@PathVariable Long userId) {
    return ResponseEntity.ok(backupService.backupToGoogleDrive(userId));
  }

  @GetMapping("/dropbox/{userId}")
  public ResponseEntity<Map<String, Object>> backupDropbox(@PathVariable Long userId) {
    return ResponseEntity.ok(backupService.backupToDropbox(userId));
  }
}
