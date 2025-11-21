import { useState, useEffect } from "react";
import { Plus, Pencil } from "lucide-react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import Modal from "../components/Modal";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";

// Format numbers with commas
const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return `$${Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

// Get current month in YYYY-MM format
const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

// Format month for display (e.g., "January 2024")
const formatMonthDisplay = (monthStr) => {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  const date = new Date(year, parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const Budgets = () => {
  useUser();

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [openBudgetModal, setOpenBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgetForm, setBudgetForm] = useState({
    categoryId: "",
    budgetAmount: "",
    month: getCurrentMonth(),
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (res.status === 200) {
        // Filter only Expense categories for budgets
        setCategories(res.data.filter((cat) => cat.type === "Expense"));
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch budgets for selected month
  const fetchBudgets = async () => {
    if (!selectedMonth) return;
    
    setLoading(true);
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_BUDGET, {
        params: { month: selectedMonth },
      });
      if (res.status === 200) {
        setBudgets(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching budgets:", err);
      // If no budgets exist, that's okay - set empty array
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch budgets when month changes
  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add Budget button
  const handleAddBudget = () => {
    setEditingBudget(null);
    setBudgetForm({
      categoryId: "",
      budgetAmount: "",
      month: selectedMonth,
    });
    setOpenBudgetModal(true);
  };

  // Handle Edit Budget
  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setBudgetForm({
      categoryId: budget.categoryId.toString(),
      budgetAmount: budget.budgetAmount.toString(),
      month: budget.month,
    });
    setOpenBudgetModal(true);
  };

  // Handle Save Budget
  const handleSaveBudget = async (e) => {
    e.preventDefault();

    if (!budgetForm.categoryId || !budgetForm.budgetAmount || !budgetForm.month) {
      toast.error("Please fill all required fields");
      return;
    }

    const amount = parseFloat(budgetForm.budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Budget amount must be greater than 0");
      return;
    }

    try {
      const res = await axiosConfig.post(API_ENDPOINTS.CREATE_OR_UPDATE_BUDGET, {
        categoryId: parseInt(budgetForm.categoryId),
        budgetAmount: amount,
        month: budgetForm.month,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success(editingBudget ? "Budget updated successfully!" : "Budget created successfully!");
        setOpenBudgetModal(false);
        fetchBudgets(); // Refresh the list
        resetForm();
      }
    } catch (err) {
      console.error("Error saving budget:", err);
      toast.error(err.response?.data?.message || "Failed to save budget");
    }
  };

  // Reset form
  const resetForm = () => {
    setBudgetForm({
      categoryId: "",
      budgetAmount: "",
      month: selectedMonth,
    });
    setEditingBudget(null);
  };

  // Calculate progress percentage
  const getProgressPercentage = (spent, budget) => {
    if (!budget || budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  // Get progress bar color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage < 80) return "bg-green-500";
    if (percentage <= 100) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? `${category.icon} ${category.name}` : "Unknown Category";
  };

  return (
    <Dashboard activeMenu="Budgets">
      <div className="m-5 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-purple-600">Monthly Budgets</h2>
          <button
            onClick={handleAddBudget}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow transition"
          >
            <Plus size={16} />
            Add Budget
          </button>
        </div>

        {/* Month Selector */}
        <div className="bg-white shadow rounded-xl p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
          {selectedMonth && (
            <p className="text-sm text-gray-600 mt-2">
              Viewing budgets for <span className="font-semibold">{formatMonthDisplay(selectedMonth)}</span>
            </p>
          )}
        </div>

        {/* Budgets Table */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 animate-pulse">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <p className="text-gray-500 text-lg">No budgets found for {formatMonthDisplay(selectedMonth)}</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Budget" to create your first budget</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remaining
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgets.map((budget) => {
                    const progressPercent = getProgressPercentage(
                      budget.spentAmount || 0,
                      budget.budgetAmount || 0
                    );
                    const progressColor = getProgressColor(progressPercent);
                    const remaining = budget.remaining || 0;

                    return (
                      <tr key={budget.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {getCategoryName(budget.categoryId)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(budget.budgetAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatCurrency(budget.spentAmount)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              remaining >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {formatCurrency(remaining)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${progressColor}`}
                              style={{ width: `${Math.min(progressPercent, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {progressPercent.toFixed(1)}%
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEditBudget(budget)}
                            className="text-purple-600 hover:text-purple-800 transition flex items-center gap-1"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Budget Modal */}
        {openBudgetModal && (
          <Modal
            title={editingBudget ? "Edit Budget" : "Add New Budget"}
            isOpen={openBudgetModal}
            onClose={() => {
              setOpenBudgetModal(false);
              resetForm();
            }}
          >
            <form onSubmit={handleSaveBudget} className="space-y-4">
              {/* Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={budgetForm.categoryId}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, categoryId: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                  disabled={!!editingBudget}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
                {editingBudget && (
                  <p className="text-xs text-gray-500 mt-1">
                    Category cannot be changed when editing
                  </p>
                )}
              </div>

              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={budgetForm.budgetAmount}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, budgetAmount: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter budget amount"
                  required
                />
              </div>

              {/* Month Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={budgetForm.month}
                  onChange={(e) =>
                    setBudgetForm({ ...budgetForm, month: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                  disabled={!!editingBudget}
                />
                {editingBudget && (
                  <p className="text-xs text-gray-500 mt-1">
                    Month cannot be changed when editing
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenBudgetModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                >
                  {editingBudget ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Dashboard>
  );
};

export default Budgets;
