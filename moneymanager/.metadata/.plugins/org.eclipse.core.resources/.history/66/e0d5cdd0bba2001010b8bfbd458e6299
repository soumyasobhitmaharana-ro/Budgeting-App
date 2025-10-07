package com.suraj.moneymanager.service;

import java.util.Collections;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.suraj.moneymanager.entity.ProfileEntity;
import com.suraj.moneymanager.repository.ProfileRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final ProfileRepo profileRepo;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

    ProfileEntity profile = profileRepo.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found" + email));
    System.out.println("Loaded user from DB: " + profile.getEmail());
    System.out.println("Encoded password in DB: " + profile.getPassword());

    return User.builder()
        .username(profile.getEmail())
        .password(profile.getPassword())
        .authorities(Collections.emptyList())
        .build();

  }

}
