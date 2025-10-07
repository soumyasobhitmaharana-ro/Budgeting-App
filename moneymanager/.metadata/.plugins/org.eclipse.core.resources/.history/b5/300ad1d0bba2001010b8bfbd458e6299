package com.suraj.moneymanager.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.suraj.moneymanager.entity.CategoryEntity;



public interface CategoryRepo extends JpaRepository<CategoryEntity, Long> 
{ 
  // select * from category where profile_id = ? 1
   List<CategoryEntity> findByProfileId(Long profileId);
//   select * from category where id = ? 1 and profile_id = ? 2
   Optional<CategoryEntity> findByIdAndProfileId(Long id, Long profileId);
//   select * from category where type = ? 1 and profile_id = ? 2
   List<CategoryEntity> findByTypeAndProfileId(String type, Long profileId);
//   select * from category where name = ? 1 and profile_id = ? 2
   Boolean existsByNameAndProfileId(String name, Long profileId);
}