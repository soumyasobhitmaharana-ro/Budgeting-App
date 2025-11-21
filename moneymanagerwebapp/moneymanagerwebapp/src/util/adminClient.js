import axiosConfig from "./axiosConfig";
import { API_ENDPOINTS } from "./apiEndpoints";

export const listUsers = async () => (await axiosConfig.get(API_ENDPOINTS.ADMIN_USERS)).data;
export const listCategories = async () => (await axiosConfig.get(API_ENDPOINTS.ADMIN_CATEGORIES)).data;
export const userTransactions = async (userId) => (await axiosConfig.get(API_ENDPOINTS.ADMIN_TRANSACTIONS(userId))).data;
