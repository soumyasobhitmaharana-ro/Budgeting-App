package com.soumya.moneymanager.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.soumya.moneymanager.dto.CategoryDTO;
import com.soumya.moneymanager.entity.CategoryEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CategoryRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryRepo categoryRepo;
  private final ProfileService profileService;

  // Save category

  public CategoryDTO saveCategory(CategoryDTO categoryDTO) {
    ProfileEntity profile = profileService.getCurrentProfile();
    if(categoryRepo.existsByNameAndProfileId(categoryDTO.getName(), profile.getId()))
    {
       throw new RuntimeException( "Category already exists");
    }
     CategoryEntity newCategory = toEntity(categoryDTO, profile);
     CategoryEntity savedCategory = categoryRepo.save(newCategory);
     return toDTO(savedCategory);
  }

  private CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile) {
    return CategoryEntity.builder()
        .id(categoryDTO.getId())
        .name(categoryDTO.getName())
        .icon(categoryDTO.getIcon())
        .type(categoryDTO.getType())
        .profile(profile)
        .build();
  }

  private CategoryDTO toDTO(CategoryEntity categoryEntity) {
    return CategoryDTO.builder()
        .id(categoryEntity.getId())
        .name(categoryEntity.getName())
        .profileId(categoryEntity.getId()!=null ? categoryEntity.getProfile().getId() : null)
        .icon(categoryEntity.getIcon())
        .type(categoryEntity.getType())
        .createdAt(categoryEntity.getCreatedAt())
        .updatedAt(categoryEntity.getUpdatedAt())
        .build();
  }


  // get categorues for current user
  public List<CategoryDTO> getCategoriesForCurrentUser(){
    ProfileEntity profile=profileService.getCurrentProfile();
    List<CategoryEntity> categories=categoryRepo.findByProfileId(profile.getId());
    return categories.stream().map(this::toDTO).toList();
  }
// get categories by type
  public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type){
    ProfileEntity profile=profileService.getCurrentProfile();
    List<CategoryEntity> categories=categoryRepo.findByTypeAndProfileId(type, profile.getId());
    return categories.stream().map(this::toDTO).toList();
  }

  public CategoryDTO updateCategory(Long id,CategoryDTO categoryDTO)
  {
    ProfileEntity profile=profileService.getCurrentProfile();
    CategoryEntity category=categoryRepo.findByIdAndProfileId(id, profile.getId()).orElseThrow(() -> new RuntimeException("Category not found"));
    category.setName(categoryDTO.getName());
    category.setIcon(categoryDTO.getIcon());
    category.setType(categoryDTO.getType());
    
    CategoryEntity updatedCategory=categoryRepo.save(category);
    return toDTO(updatedCategory);
  }
  
  public void deleteCategory(Long id)
  {
	  ProfileEntity profile=profileService.getCurrentProfile();
	    CategoryEntity category=categoryRepo.findByIdAndProfileId(id, profile.getId()).orElseThrow(() -> new RuntimeException("Category not found"));
	    categoryRepo.delete(category);
  }

}
