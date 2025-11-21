import { useState, useEffect } from "react";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

export const DashboardData = () => {
  const [data, setData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
    recentTransactions: [],
    allIncomes: [],
    allExpenses: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch dashboard summary (explicit path for clarity)
        const dashboardRes = await axiosConfig.get("/dashboard");
        
        // Fetch all incomes and expenses for analytics
        const [incomesRes, expensesRes, categoriesRes] = await Promise.all([
          axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES),
          axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES),
        ]);

        setData({
          ...dashboardRes.data,
          allIncomes: incomesRes.data || [],
          allExpenses: expensesRes.data || [],
          categories: categoriesRes.data || [],
        });
      } catch (err) {
        const status = err?.response?.status;
        const url = err?.config?.url || err?.response?.config?.url;
        const message = err?.response?.data || err?.message || err;
        console.error("[dashboard] Fetch error:", { status, url, message });
        // Set empty arrays on error
        setData(prev => ({
          ...prev,
          allIncomes: [],
          allExpenses: [],
          categories: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading };
};
