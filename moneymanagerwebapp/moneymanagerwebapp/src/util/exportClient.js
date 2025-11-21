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

const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const downloadPdf = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Missing user");
  const res = await axiosConfig.get(`${API_ENDPOINTS.EXPORT_PDF}/${userId}`, { responseType: "blob" });
  downloadBlob(res.data, `finance_export_${userId}.pdf`);
};

export const downloadCsv = async () => {
  const userId = getUserId();
  if (!userId) throw new Error("Missing user");
  const res = await axiosConfig.get(`${API_ENDPOINTS.EXPORT_CSV}/${userId}`, { responseType: "blob" });
  downloadBlob(res.data, `finance_export_${userId}.csv`);
};
