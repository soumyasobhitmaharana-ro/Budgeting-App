package com.soumya.moneymanager.entity;

import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="tbl_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProfileEntity {


  @Id
  @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;
  private String fullName;
  @Column(unique=true)
  private String email;
  private String password;
  private String profileImageUrl;
  @Column(updatable=false)
  @CreationTimestamp
  private LocalDate createdAt;
  @UpdateTimestamp
  private LocalDate updatedAt;
  private Boolean isActive;

  private String activationToken;
  
  private String resetPasswordToken;


  public void prePersist()
  {
    if(this.isActive == null)
    {
      this.isActive = false;
    }
  }

  

}
