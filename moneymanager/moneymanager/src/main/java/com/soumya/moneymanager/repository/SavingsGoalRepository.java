package com.soumya.moneymanager.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soumya.moneymanager.entity.SavingsGoalEntity;

public interface SavingsGoalRepository extends JpaRepository<SavingsGoalEntity, UUID> {

  // Find all goals for a user
  List<SavingsGoalEntity> findByUserId(Long userId);
}

