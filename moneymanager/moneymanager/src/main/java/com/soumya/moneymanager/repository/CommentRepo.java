package com.soumya.moneymanager.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.soumya.moneymanager.entity.CommentEntity;
import com.soumya.moneymanager.entity.PostEntity;

public interface CommentRepo extends JpaRepository<CommentEntity, Long> {
  List<CommentEntity> findByPost(PostEntity post);
}
