export const BASE_URL  = "http://localhost:8082/api/v1.0";
// export const BASE_URL  = "https://money-manager-ydrs.onrender.com/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "db3amflbg";

export const API_ENDPOINTS = {
  LOGIN: "/login",
  REGISTER: "/register",
  GET_USER_INFO: "/profile",
  GET_ALL_CATEGORIES: "/categories",
  ADD_CATEGORY:"/categories",
   EDIT_CATEGORY: "/categories",            // PUT /categories/:id
  DELETE_CATEGORY: "/categories",          // DELETE /categories/:id
  GET_ALL_INCOME: "/income",
  ADD_INCOME: "/income",
  // EDIT_INCOME: "/income",                  // PUT /income/:id
  DELETE_INCOME: "/income",                // DELETE /income/:id
  INCOME_EXCEL_DOWNLOAD:"excel/download/income",
  EMAIL_INCOME:"/email/income-excel",

  GET_ALL_EXPENSES: "/expenses",
  ADD_EXPENSE:"/expenses",
  DELETE_EXPENSE:"/expenses",
  EXPENSE_EXCEL_DOWNLOAD:"excel/download/expense",
  EMAIL_EXPENSE:"/email/expense-excel",
  FILTER:"/filter",
  DASH_BOARD:"/dashboard",
  UPDATE_PROFILE_IMAGE: "/update-profile-image",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
   
   
  UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
  
}


