package com.soumya.moneymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soumya.moneymanager.entity.PostEntity;

public interface PostRepo extends JpaRepository<PostEntity, Long> {
}
