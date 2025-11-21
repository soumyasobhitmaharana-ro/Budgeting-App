package com.soumya.moneymanager.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.soumya.moneymanager.dto.CommentDTO;
import com.soumya.moneymanager.dto.PostDTO;
import com.soumya.moneymanager.service.CommunityService;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class CommunityController {

  private final CommunityService communityService;

  @GetMapping
  public ResponseEntity<List<PostDTO>> listPosts() {
    return ResponseEntity.ok(communityService.getAllPosts());
  }

  @GetMapping("/{id}")
  public ResponseEntity<PostDTO> getPost(@PathVariable Long id) {
    return ResponseEntity.ok(communityService.getPost(id));
  }

  @PostMapping
  public ResponseEntity<PostDTO> createPost(@RequestBody CreatePostRequest req) {
    return ResponseEntity.ok(communityService.createPost(req.getContent()));
  }

  @PostMapping("/{id}/comments")
  public ResponseEntity<CommentDTO> addComment(@PathVariable Long id, @RequestBody AddCommentRequest req) {
    return ResponseEntity.ok(communityService.addComment(id, req.getContent()));
  }

  @PostMapping("/{id}/like")
  public ResponseEntity<PostDTO> like(@PathVariable Long id) {
    return ResponseEntity.ok(communityService.likePost(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    communityService.deletePost(id);
    return ResponseEntity.noContent().build();
  }

  @Data
  public static class CreatePostRequest { private String content; }

  @Data
  public static class AddCommentRequest { private String content; }
}
