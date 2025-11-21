package com.soumya.moneymanager.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.soumya.moneymanager.dto.CommentDTO;
import com.soumya.moneymanager.dto.PostDTO;
import com.soumya.moneymanager.entity.CommentEntity;
import com.soumya.moneymanager.entity.PostEntity;
import com.soumya.moneymanager.entity.ProfileEntity;
import com.soumya.moneymanager.repository.CommentRepo;
import com.soumya.moneymanager.repository.PostRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommunityService {

  private final PostRepo postRepo;
  private final CommentRepo commentRepo;
  private final ProfileService profileService;
  private final Map<Long, Set<Long>> userLikes = new HashMap<>();

  public List<PostDTO> getAllPosts() {
    return postRepo.findAll().stream()
        .map(this::toDTOWithCounts)
        .collect(Collectors.toList());
  }

  public PostDTO getPost(Long id) {
    PostEntity post = postRepo.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
    return toDTOWithCounts(post);
  }

  @Transactional
  public PostDTO createPost(String content) {
    ProfileEntity user = profileService.getCurrentProfile();
    PostEntity post = PostEntity.builder().user(user).content(content).likes(0).build();
    post = postRepo.save(post);
    return toDTOWithCounts(post);
  }

  @Transactional
  public CommentDTO addComment(Long postId, String content) {
    ProfileEntity user = profileService.getCurrentProfile();
    PostEntity post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
    CommentEntity c = CommentEntity.builder().post(post).user(user).content(content).build();
    c = commentRepo.save(c);
    return toDTO(c);
  }

  @Transactional
  public synchronized PostDTO likePost(Long postId) {
    PostEntity post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
    ProfileEntity user = profileService.getCurrentProfile();
    Long userId = user.getId();

    Set<Long> likedUsers = userLikes.computeIfAbsent(postId, k -> new HashSet<>());

    if (likedUsers.contains(userId)) {
      likedUsers.remove(userId);
      post.setLikes(Math.max(0, post.getLikes() - 1));
      post = postRepo.save(post);
      return toDTOWithCounts(post);
    } else {
      likedUsers.add(userId);
      post.setLikes(post.getLikes() + 1);
      post = postRepo.save(post);
      return toDTOWithCounts(post);
    }
  }

  private PostDTO toDTOWithCounts(PostEntity post) {
    List<CommentEntity> comments = commentRepo.findByPost(post);
    return PostDTO.builder()
        .id(post.getId())
        .userId(post.getUser().getId())
        .userName(post.getUser().getFullName())
        .content(post.getContent())
        .likes(post.getLikes())
        .commentCount(comments.size())
        .createdAt(post.getCreatedAt())
        .comments(comments.stream().map(this::toDTO).toList())
        .build();
  }

  private CommentDTO toDTO(CommentEntity c) {
    return CommentDTO.builder()
        .id(c.getId())
        .postId(c.getPost().getId())
        .userId(c.getUser().getId())
        .userName(c.getUser().getFullName())
        .content(c.getContent())
        .createdAt(c.getCreatedAt())
        .build();
  }

  @Transactional
  public void deletePost(Long postId) {
    PostEntity post = postRepo.findById(postId).orElseThrow(() -> new RuntimeException("Post not found"));
    ProfileEntity current = profileService.getCurrentProfile();
    if (!post.getUser().getId().equals(current.getId())) {
      throw new RuntimeException("Not authorized to delete this post");
    }
    List<CommentEntity> comments = commentRepo.findByPost(post);
    if (!comments.isEmpty()) {
      commentRepo.deleteAll(comments);
    }
    postRepo.delete(post);
    userLikes.remove(postId);
  }
}
