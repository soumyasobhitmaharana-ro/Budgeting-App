package com.soumya.moneymanager.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostDTO {
  private Long id;
  private Long userId;
  private String userName;
  private String content;
  private int likes;
  private int commentCount;
  private LocalDateTime createdAt;
  private List<CommentDTO> comments;
}
