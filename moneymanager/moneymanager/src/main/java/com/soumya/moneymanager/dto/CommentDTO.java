package com.soumya.moneymanager.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentDTO {
  private Long id;
  private Long postId;
  private Long userId;
  private String userName;
  private String content;
  private LocalDateTime createdAt;
}
