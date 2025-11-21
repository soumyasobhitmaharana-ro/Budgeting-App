package com.soumya.moneymanager.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.SavingsGoalDTO;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.entity.SavingsGoalEntity;
import com.soumya.moneymanager.repository.SavingsGoalRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SavingsGoalService {

  private final SavingsGoalRepository savingsGoalRepository;
  private final ProfileService profileService;

  /**
   * Create or update a savings goal
   */
  public SavingsGoalDTO createGoal(SavingsGoalDTO goalDTO) {
    ProfileEntity profile = profileService.getCurrentProfile();
    Long userId = profile.getId();

    // Validate target amount
    if (goalDTO.getTargetAmount() == null || goalDTO.getTargetAmount() <= 0) {
      throw new RuntimeException("Target amount must be greater than 0");
    }

    // Validate saved amount
    if (goalDTO.getSavedAmount() == null || goalDTO.getSavedAmount() < 0) {
      throw new RuntimeException("Saved amount must be 0 or greater");
    }

    // Validate saved amount doesn't exceed target
    if (goalDTO.getSavedAmount() > goalDTO.getTargetAmount()) {
      throw new RuntimeException("Saved amount cannot exceed target amount");
    }

    // Validate deadline
    if (goalDTO.getDeadline() == null) {
      throw new RuntimeException("Deadline is required");
    }

    // Validate goal name
    if (goalDTO.getGoalName() == null || goalDTO.getGoalName().trim().isEmpty()) {
      throw new RuntimeException("Goal name is required");
    }

    SavingsGoalEntity goalEntity;
    if (goalDTO.getId() != null) {
      // Update existing goal
      Optional<SavingsGoalEntity> existingGoal = savingsGoalRepository.findById(goalDTO.getId());
      if (existingGoal.isEmpty()) {
        throw new RuntimeException("Goal not found");
      }
      
      goalEntity = existingGoal.get();
      // Validate that goal belongs to current user
      if (!goalEntity.getUserId().equals(userId)) {
        throw new RuntimeException("Unauthorized to update this goal");
      }
      
      // Update fields
      goalEntity.setGoalName(goalDTO.getGoalName().trim());
      goalEntity.setTargetAmount(goalDTO.getTargetAmount());
      goalEntity.setSavedAmount(goalDTO.getSavedAmount());
      goalEntity.setDeadline(goalDTO.getDeadline());
    } else {
      // Create new goal
      goalEntity = SavingsGoalEntity.builder()
          .userId(userId)
          .goalName(goalDTO.getGoalName().trim())
          .targetAmount(goalDTO.getTargetAmount())
          .savedAmount(goalDTO.getSavedAmount() != null ? goalDTO.getSavedAmount() : 0.0)
          .deadline(goalDTO.getDeadline())
          .build();
    }

    SavingsGoalEntity savedGoal = savingsGoalRepository.save(goalEntity);
    return toDTO(savedGoal);
  }

  /**
   * Get all goals for a user
   */
  public List<SavingsGoalDTO> getGoalsByUser(Long userId) {
    ProfileEntity currentProfile = profileService.getCurrentProfile();

    // Use provided userId or current user's id
    Long targetUserId = (userId != null) ? userId : currentProfile.getId();

    // Validate that user can only access their own goals
    if (!targetUserId.equals(currentProfile.getId())) {
      throw new RuntimeException("Unauthorized to access goals for this user");
    }

    // Get all goals for user
    List<SavingsGoalEntity> goals = savingsGoalRepository.findByUserId(targetUserId);

    // Convert to DTOs
    return goals.stream().map(this::toDTO).toList();
  }

  /**
   * Convert entity to DTO
   */
  private SavingsGoalDTO toDTO(SavingsGoalEntity entity) {
    return SavingsGoalDTO.builder()
        .id(entity.getId())
        .userId(entity.getUserId())
        .goalName(entity.getGoalName())
        .targetAmount(entity.getTargetAmount())
        .savedAmount(entity.getSavedAmount())
        .deadline(entity.getDeadline())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}

