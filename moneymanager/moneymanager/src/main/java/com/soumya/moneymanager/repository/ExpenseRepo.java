package com.soumya.moneymanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.soumya.moneymanager.entity.ExpenseEntity;
import com.soumya.moneymanager.entity.IncomeEntity;

public interface ExpenseRepo extends  JpaRepository<ExpenseEntity, Long>{

  // select * from expense where profile_id = ? 1
  List<ExpenseEntity> findByProfileIdOrderByDateDesc(Long profileId);

  // select top 5 from expense where profile_id = ? 1 order by date desc 
  List<ExpenseEntity> findTop5ByProfileIdOrderByDateDesc(Long profileId);


  @Query("select sum(e.amount) from ExpenseEntity e where e.profile.id = :profileId")
  BigDecimal findTotalExpenseByProfileId(@Param("profileId") Long profileId);

  // Sum expenses by category, profile, and date range
  @Query("select sum(e.amount) from ExpenseEntity e where e.profile.id = :profileId and e.category.id = :categoryId and e.date between :startDate and :endDate")
  BigDecimal findTotalExpenseByProfileIdAndCategoryIdAndDateBetween(@Param("profileId") Long profileId, @Param("categoryId") Long categoryId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

 
 // select * from expense where profile_id = ? 1 and date between ? 2 and ? 3
  List<ExpenseEntity> findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(Long profileId, LocalDate startDate, LocalDate endDate, String keyword,Sort sort);

// select * from expense where profile_id = ? 1 and date between ? 2 and ? 3
  List<ExpenseEntity> findByProfileIdAndDateBetween(Long profileId, LocalDate startDate, LocalDate endDate);
// select * from expense where profile_id = ? 1 and date = ? 2
  List<ExpenseEntity> findByProfileIdAndDate(Long profileId,LocalDate date);

List<ExpenseEntity> findByProfileId(Long id);
  
}
