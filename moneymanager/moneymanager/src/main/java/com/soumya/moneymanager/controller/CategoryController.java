package com.soumya.moneymanager.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.CategoryDTO;
import com.soumya.moneymanager.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {

  private final CategoryService categoryService;


@PostMapping
  public ResponseEntity<CategoryDTO> savecategory(@RequestBody CategoryDTO categoryDTO)
  {
      CategoryDTO savedCategory=categoryService.saveCategory(categoryDTO);
      return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory);
  }

  @GetMapping
  public ResponseEntity<List<CategoryDTO>> getCategoriesForCurrentUser() {
    List<CategoryDTO> categories = categoryService.getCategoriesForCurrentUser();
    return ResponseEntity.ok(categories);
  }

  @GetMapping("/{type}")
  public ResponseEntity<List<CategoryDTO>> getCategoriesByTypeForCurrentUser(@PathVariable String type) {
    List<CategoryDTO> categories = categoryService.getCategoriesByTypeForCurrentUser(type.toUpperCase());
    return ResponseEntity.ok(categories);
  }

  @PutMapping("/{id}")
  public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id,@RequestBody CategoryDTO categoryDTO) {

    CategoryDTO updatedCategory=categoryService.updateCategory(id, categoryDTO);
    return  ResponseEntity.ok(updatedCategory);
    
  }
  
  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteCategory(@PathVariable Long id)
  {
	  categoryService.deleteCategory(id);
	  return ResponseEntity.ok("Delete Success");
  }


}
