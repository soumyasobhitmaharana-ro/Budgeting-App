export const BASE_URL = "http://localhost:8082/api/v1.0";
// export const BASE_URL = "https://money-manager-ydrs.onrender.com/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "db3amflbg";
// Backend modules added outside /api/v1.0 prefix use the API root without version
const API_ROOT = BASE_URL.replace("/api/v1.0", "");

export const API_ENDPOINTS = {
  // 🔐 Auth & Profile
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/profile",
  UPDATE_PROFILE_IMAGE: "/update-profile-image",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // 🗂️ Category
  GET_ALL_CATEGORIES: "/categories",
  ADD_CATEGORY: "/categories",
  EDIT_CATEGORY: "/categories",       // PUT /categories/:id
  DELETE_CATEGORY: "/categories",     // DELETE /categories/:id

  // 💰 Income
  GET_ALL_INCOME: "/income",
  ADD_INCOME: "/income",
  UPDATE_INCOME: "/income",           // ✅ Added for PUT /income/:id
  DELETE_INCOME: "/income",           // DELETE /income/:id
  INCOME_EXCEL_DOWNLOAD: "/excel/download/income",
  EMAIL_INCOME: "/email/income-excel",

  // 💸 Expense
  GET_ALL_EXPENSES: "/expenses",
  ADD_EXPENSE: "/expenses",
  UPDATE_EXPENSE: "/expenses",        // PUT /expenses/:id
  DELETE_EXPENSE: "/expenses",
  EXPENSE_EXCEL_DOWNLOAD: "/excel/download/expense",
  EMAIL_EXPENSE: "/email/expense-excel",

  // 📊 Filter & Dashboard
  FILTER: "/filter",
  DASH_BOARD: "/dashboard",

  // 💰 Budget
  GET_BUDGET: "/budget",
  CREATE_OR_UPDATE_BUDGET: "/budget",

  // 🎯 Savings Goals
  GET_GOALS: "/goals",
  CREATE_OR_UPDATE_GOAL: "/goals",
  DELETE_GOAL: "/goals",             // DELETE /goals/:id

  // ☁️ Cloudinary upload
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,

  // 📤 New Export formats (absolute to bypass BASE_URL version prefix)
  EXPORT_PDF: `/export/pdf`,         // + /{userId}
  EXPORT_CSV: `/export/csv`,         // + /{userId}

  // 🔄 Backup
  BACKUP_GOOGLE: `/backup/google-drive`, // + /{userId}
  BACKUP_DROPBOX: `/backup/dropbox`,     // + /{userId}

  // 🗣️ Community
  POSTS: `/posts`,                 // GET, POST
  POST_COMMENTS: (postId) => `/posts/${postId}/comments`,
  POST_LIKE: (postId) => `/posts/${postId}/like`,

  // Admin
  ADMIN_USERS: `/admin/users`,
  ADMIN_CATEGORIES: `/admin/categories`,
  ADMIN_TRANSACTIONS: (userId) => `/admin/transactions/${userId}`,
};
