import axiosConfig from "./axiosConfig";
import { API_ENDPOINTS } from "./apiEndpoints";

const getUserId = () => {
  try {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u).id : null;
  } catch {
    return null;
  }
};

export const backupGoogleDrive = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Missing user");
  const res = await axiosConfig.get(`${API_ENDPOINTS.BACKUP_GOOGLE}/${userId}`);
  return res.data;
};

export const backupDropbox = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Missing user");
  const res = await axiosConfig.get(`${API_ENDPOINTS.BACKUP_DROPBOX}/${userId}`);
  return res.data;
};
