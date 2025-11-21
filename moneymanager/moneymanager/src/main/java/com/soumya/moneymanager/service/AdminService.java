package com.soumya.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.ExpenseDTO;
import com.soumya.moneymanager.dto.IncomeDTO;
import com.soumya.moneymanager.entity.ExpenseEntity;
import com.soumya.moneymanager.entity.IncomeEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryRepo;
import com.soumya.moneymanager.repository.ExpenseRepo;
import com.soumya.moneymanager.repository.IncomeRepo;
import com.soumya.moneymanager.repository.ProfileRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

  private final ProfileRepo profileRepo;
  private final CategoryRepo categoryRepo;
  private final IncomeRepo incomeRepo;
  private final ExpenseRepo expenseRepo;
  private final ProfileService profileService;

  @Value("${app.admin.emails:}")
  private String adminEmailsCsv;

  public boolean isCurrentUserAdmin() {
    ProfileEntity me = profileService.getCurrentProfile();
    if (me == null) return false;
    if (adminEmailsCsv == null || adminEmailsCsv.isBlank()) return false;
    for (String e : adminEmailsCsv.split(",")) {
      if (me.getEmail().equalsIgnoreCase(e.trim())) return true;
    }
    return false;
  }

  public List<ProfileEntity> listUsers() {
    return profileRepo.findAll();
  }

  public List<Map<String, Object>> listCategories() {
    return categoryRepo.findAll().stream().map(c -> {
      Map<String, Object> m = new HashMap<>();
      m.put("id", c.getId());
      m.put("name", c.getName());
      m.put("icon", c.getIcon());
      m.put("type", c.getType());
      return m;
    }).toList();
  }

  public Map<String, Object> transactionsForUser(Long userId) {
    List<IncomeEntity> incomes = incomeRepo.findByProfileId(userId);
    List<ExpenseEntity> expenses = expenseRepo.findByProfileId(userId);

    List<Map<String, Object>> tx = new ArrayList<>();
    incomes.forEach(i -> tx.add(mapTxn(i)));
    expenses.forEach(e -> tx.add(mapTxn(e)));

    Map<String, Object> res = new HashMap<>();
    res.put("userId", userId);
    res.put("transactions", tx);
    res.put("count", tx.size());
    return res;
  }

  private Map<String, Object> mapTxn(IncomeEntity i) {
    Map<String, Object> m = new HashMap<>();
    m.put("id", i.getId());
    m.put("type", "INCOME");
    m.put("name", i.getName());
    m.put("category", i.getCategory()!=null? i.getCategory().getName():null);
    m.put("amount", i.getAmount());
    m.put("date", i.getDate());
    return m;
  }

  private Map<String, Object> mapTxn(ExpenseEntity e) {
    Map<String, Object> m = new HashMap<>();
    m.put("id", e.getId());
    m.put("type", "EXPENSE");
    m.put("name", e.getName());
    m.put("category", e.getCategory()!=null? e.getCategory().getName():null);
    m.put("amount", e.getAmount());
    m.put("date", e.getDate());
    return m;
  }
}
