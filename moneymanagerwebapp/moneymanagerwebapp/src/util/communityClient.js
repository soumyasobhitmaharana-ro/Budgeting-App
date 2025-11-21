import axiosConfig from "./axiosConfig";
import { API_ENDPOINTS } from "./apiEndpoints";

export const listPosts = async () => {
  const res = await axiosConfig.get(API_ENDPOINTS.POSTS);
  return res.data;
};

export const createPost = async (content) => {
  const res = await axiosConfig.post(API_ENDPOINTS.POSTS, { content });
  return res.data;
};

export const addComment = async (postId, content) => {
  const res = await axiosConfig.post(API_ENDPOINTS.POST_COMMENTS(postId), { content });
  return res.data;
};

export const likePost = async (postId) => {
  const res = await axiosConfig.post(API_ENDPOINTS.POST_LIKE(postId));
  return res.data;
};
