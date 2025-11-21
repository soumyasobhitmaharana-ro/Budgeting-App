import { useState, useEffect } from "react";
import { Plus, Pencil, Target as TargetIcon, Loader2, Trash2, Coins } from "lucide-react";
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

// Format date for display
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Check if deadline has passed
const isDeadlinePassed = (deadlineStr) => {
  if (!deadlineStr) return false;
  const deadline = new Date(deadlineStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  return deadline < today;
};

const SavingsGoals = () => {
  useUser();

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [openGoalModal, setOpenGoalModal] = useState(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [activeGoal, setActiveGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });
  const [contributionForm, setContributionForm] = useState({ amount: "" });
  const [deletingId, setDeletingId] = useState(null);

  // Fetch goals on page load
  const fetchGoals = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axiosConfig.get(API_ENDPOINTS.GET_GOALS, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.status === 200) {
        setGoals(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
      if (err?.response?.status === 403) toast.error("Unauthorized. Please log in again.");
      // If no goals exist, that's okay - set empty array
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, []);

  // Handle Add Goal button
  const handleAddGoal = () => {
    setEditingGoal(null);
    setGoalForm({
      name: "",
      targetAmount: "",
      deadline: "",
    });
    setOpenGoalModal(true);
  };

  // Handle Edit Goal
  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setGoalForm({
      name: goal.goalName || goal.name || "",
      targetAmount: goal.targetAmount?.toString() || "",
      deadline: goal.deadline ? (goal.deadline.split("T")[0] || goal.deadline) : "",
    });
    setOpenGoalModal(true);
  };

  // Handle Save Goal
  const handleSaveGoal = async (e) => {
    e.preventDefault();

    if (!goalForm.name || !goalForm.targetAmount || !goalForm.deadline) {
      toast.error("Please fill all required fields");
      return;
    }

    const targetAmount = parseFloat(goalForm.targetAmount);

    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast.error("Target amount must be greater than 0");
      return;
    }

    // Normalize deadline to yyyy-MM-dd
    const normalizeDate = (d) => {
      try {
        // If already yyyy-MM-dd
        if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
        const date = new Date(d);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      } catch {
        return d;
      }
    };

    setSaving(true);
    try {
      const payload = {
        goalName: goalForm.name.trim(),
        targetAmount: targetAmount,
        savedAmount: editingGoal ? (editingGoal.savedAmount || 0) : 0,
        deadline: normalizeDate(goalForm.deadline),
      };

      // If editing, include the id
      if (editingGoal && editingGoal.id) {
        payload.id = editingGoal.id;
      }

      const token = localStorage.getItem("token");
      const res = await axiosConfig.post(API_ENDPOINTS.CREATE_OR_UPDATE_GOAL, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.status === 201 || res.status === 200) {
        toast.success(editingGoal ? "Goal updated successfully!" : "Goal created successfully!");
        setOpenGoalModal(false);
        resetForm();
        // Refresh the list after adding/updating
        await fetchGoals();
      }
    } catch (err) {
      console.error("Error saving goal:", err);
      if (err?.response?.status === 403) {
        toast.error("Unauthorized. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to save goal");
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setGoalForm({
      name: "",
      targetAmount: "",
      deadline: "",
    });
    setEditingGoal(null);
  };

  // Calculate progress percentage
  const getProgressPercentage = (saved, target) => {
    if (!target || target === 0) return 0;
    return Math.min((saved / target) * 100, 100);
  };

  // Get progress bar color based on percentage and deadline
  const getProgressColor = (percentage, deadline) => {
    const deadlinePassed = isDeadlinePassed(deadline);
    
    // Red if deadline passed OR >= 100%
    if (deadlinePassed || percentage >= 100) {
      return "bg-red-500";
    }
    
    // Yellow >= 80%
    if (percentage >= 80) {
      return "bg-yellow-500";
    }
    
    // Green < 80%
    return "bg-green-500";
  };

  // Delete goal
  const handleDeleteGoal = async (goal) => {
    if (!goal?.id) {
      toast.error("Goal ID missing");
      return;
    }
    const ok = window.confirm("Delete this goal? This cannot be undone.");
    if (!ok) return;
    setDeletingId(goal.id);
    try {
      const res = await axiosConfig.delete(`${API_ENDPOINTS.DELETE_GOAL}/${goal.id}`);
      if (res.status === 200 || res.status === 204) {
        toast.success("Goal deleted");
        await fetchGoals();
      } else {
        toast.error("Failed to delete goal");
      }
    } catch (err) {
      console.error("Error deleting goal:", err);
      toast.error(err.response?.data?.message || "Failed to delete goal");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Dashboard activeMenu="Savings Goals">
      <div className="m-5 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 flex-wrap gap-4">
          <h2 className="text-2xl font-bold text-purple-600">Savings Goals</h2>
          <button
            onClick={handleAddGoal}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow transition"
          >
            <Plus size={16} />
            Add Goal
          </button>
        </div>

        {/* Goals Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
            <p className="text-gray-500 ml-3">Loading goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <TargetIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No goals yet</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add Goal" to create your first savings goal</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal, index) => {
              const progressPercent = getProgressPercentage(
                goal.savedAmount || 0,
                goal.targetAmount || 0
              );
              const progressColor = getProgressColor(progressPercent, goal.deadline);
              const deadlinePassed = isDeadlinePassed(goal.deadline);
              const remaining = Math.max((goal.targetAmount || 0) - (goal.savedAmount || 0), 0);
              const isCompleted = (goal.savedAmount || 0) >= (goal.targetAmount || 0);

              return (
                <div
                  key={goal.id || index}
                  className={`bg-white shadow rounded-xl p-6 hover:shadow-lg transition border ${
                    isCompleted
                      ? "border-green-200"
                      : deadlinePassed && !isCompleted
                      ? "border-red-200"
                      : "border-transparent"
                  }`}
                >
                  {/* Goal Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {goal.goalName || goal.name}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {deadlinePassed && !isCompleted && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                            Overdue
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveGoal(goal);
                          setContributionForm({ amount: "" });
                          setOpenContributionModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-800 transition p-1"
                        title="Add Contribution"
                      >
                        <Coins size={18} />
                      </button>
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="text-purple-600 hover:text-purple-800 transition p-1"
                        title="Edit Goal"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal)}
                        className="text-red-600 hover:text-red-800 transition p-1"
                        title="Delete Goal"
                        disabled={deletingId === goal.id}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Target and Saved */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Saved</span>
                      <span className="text-sm font-semibold text-purple-600">
                        {formatCurrency(goal.savedAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Progress</span>
                      <span className="text-xs font-medium text-gray-700">
                        {progressPercent.toFixed(1)}% Completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${progressColor}`}
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Deadline */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Deadline</span>
                      <span
                        className={`text-xs font-medium ${
                          deadlinePassed ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        {formatDate(goal.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add/Edit Goal Modal */}
        {openGoalModal && (
          <Modal
            title={editingGoal ? "Edit Goal" : "Add New Goal"}
            isOpen={openGoalModal}
            onClose={() => {
              setOpenGoalModal(false);
              resetForm();
            }}
          >
            <form onSubmit={handleSaveGoal} className="space-y-4">
              {/* Goal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={goalForm.name}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="e.g., Vacation Fund, Emergency Fund"
                  required
                />
              </div>

              {/* Target Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={goalForm.targetAmount}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, targetAmount: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter target amount"
                  required
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline
                </label>
                <input
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) =>
                    setGoalForm({ ...goalForm, deadline: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenGoalModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGoal ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Add Contribution Modal */}
        {openContributionModal && (
          <Modal
            title={`Add Contribution${activeGoal ? ` - ${activeGoal.goalName || activeGoal.name}` : ""}`}
            isOpen={openContributionModal}
            onClose={() => {
              setOpenContributionModal(false);
              setActiveGoal(null);
              setContributionForm({ amount: "" });
            }}
          >
            <form onSubmit={async (e) => {
              e.preventDefault();
              const amount = parseFloat(contributionForm.amount);
              if (isNaN(amount) || amount <= 0) {
                toast.error("Please enter a valid amount > 0");
                return;
              }
              if (!activeGoal) return;

              setSaving(true);
              try {
                const payload = {
                  id: activeGoal.id,
                  goalName: activeGoal.goalName || activeGoal.name,
                  targetAmount: activeGoal.targetAmount,
                  savedAmount: (activeGoal.savedAmount || 0) + amount,
                  deadline: activeGoal.deadline?.split("T")[0] || activeGoal.deadline,
                };

                const res = await axiosConfig.post(
                  API_ENDPOINTS.CREATE_OR_UPDATE_GOAL,
                  payload
                );
                if (res.status === 200 || res.status === 201) {
                  toast.success("Contribution added");
                  setOpenContributionModal(false);
                  setActiveGoal(null);
                  setContributionForm({ amount: "" });
                  await fetchGoals();
                }
              } catch (err) {
                console.error("Error adding contribution:", err);
                toast.error(err.response?.data?.message || "Failed to add contribution");
              } finally {
                setSaving(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={contributionForm.amount}
                  onChange={(e) => setContributionForm({ amount: e.target.value })}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Enter contribution amount"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenContributionModal(false);
                    setActiveGoal(null);
                    setContributionForm({ amount: "" });
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Dashboard>
  );
};

export default SavingsGoals;
