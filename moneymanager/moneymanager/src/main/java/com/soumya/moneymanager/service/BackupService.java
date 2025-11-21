package com.soumya.moneymanager.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.repository.ExpenseRepo;
import com.soumya.moneymanager.repository.IncomeRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BackupService {

  private final IncomeRepo incomeRepo;
  private final ExpenseRepo expenseRepo;

  public Map<String, Object> backupToGoogleDrive(Long userId) {
    // Dummy integration: pretend we've uploaded user's income and expense dataset
    long incomeCount = incomeRepo.findByProfileId(userId).size();
    long expenseCount = expenseRepo.findByProfileId(userId).size();

    Map<String, Object> resp = new HashMap<>();
    resp.put("provider", "google-drive");
    resp.put("status", "success");
    resp.put("userId", userId);
    resp.put("itemsBackedUp", incomeCount + expenseCount);
    resp.put("message", "Backup completed (dummy).");
    return resp;
  }

  public Map<String, Object> backupToDropbox(Long userId) {
    long incomeCount = incomeRepo.findByProfileId(userId).size();
    long expenseCount = expenseRepo.findByProfileId(userId).size();

    Map<String, Object> resp = new HashMap<>();
    resp.put("provider", "dropbox");
    resp.put("status", "success");
    resp.put("userId", userId);
    resp.put("itemsBackedUp", incomeCount + expenseCount);
    resp.put("message", "Backup completed (dummy).");
    return resp;
  }
}
