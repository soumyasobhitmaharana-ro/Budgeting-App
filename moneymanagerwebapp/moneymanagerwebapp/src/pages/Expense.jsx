import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import ExpenseList from "../components/ExpenseList";
import Modal from "../components/Modal";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import ExpenseOverview from "../components/ExpenseOverview";

const Expense = () => {
  useUser();

  const [expenseData, setExpenseData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    icon: "",
    date: "",
  });

  // Fetch expenses
  const fetchExpenseData = async () => {
    setLoading(true);
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_EXPENSES);
      if (res.status === 200) setExpenseData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (res.status === 200) setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch categories");
    }
  };

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(
        API_ENDPOINTS.EXPENSE_EXCEL_DOWNLOAD,
        { responseType: "blob" }
      );
      let filename = "expense_details.xlsx";
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Expense details downloaded successfully");
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error(
        error.response?.data?.message || "Failed to download expense details"
      );
    }
  };

  const handleEmailExpenseDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_EXPENSE);
      if (response.status === 200) {
        toast.success("Expense report emailed successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error.response?.data?.message || "Failed to send email");
    }
  };

  useEffect(() => {
    fetchExpenseData();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmojiClick = (emojiData) => {
    setFormData({ ...formData, icon: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const handleSaveExpense = async () => {
    const today = new Date();
    const selectedDate = new Date(formData.date);

    if (!formData.name || !formData.amount || !formData.categoryId || !formData.date) {
      toast.error("Please fill all required fields");
      return;
    }

    if (selectedDate > today) {
      toast.error("Date can't be in the future");
      return;
    }

    const duplicate = expenseData.find(
      (e) => e.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (duplicate) {
      toast.error("Expense with this name already exists");
      return;
    }

    try {
      const res = await axiosConfig.post(API_ENDPOINTS.ADD_EXPENSE, {
        ...formData,
        type: "expense",
      });
      if (res.status === 201) {
        toast.success("Expense added successfully!");
        fetchExpenseData();
        setOpenAddExpenseModal(false);
        setFormData({
          name: "",
          amount: "",
          categoryId: "",
          icon: "",
          date: "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmed) return;

    try {
      await axiosConfig.delete(`${API_ENDPOINTS.DELETE_EXPENSE}/${id}`);
      toast.success("Expense deleted successfully");
      fetchExpenseData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete expense");
    }
  };

  return (
    <Dashboard activeMenu="Expense">
      <div className="m-5 mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-red-600">Expense Dashboard</h2>
          <button
            onClick={() => setOpenAddExpenseModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow transition"
          >
            <Plus size={16} /> Add Expense
          </button>
        </div>

        {/* Chart */}
        <ExpenseOverview transactions={expenseData} />

        {/* Expense List */}
        <ExpenseList
          transactions={expenseData.map((e) => ({
            ...e,
            category: categories.find((c) => c.id === e.categoryId),
          }))}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={handleDeleteExpense}
          onDownload={handleDownloadExpenseDetails}
          onEmail={handleEmailExpenseDetails}
        />

        {/* Add Expense Modal */}
        {openAddExpenseModal && (
          <Modal
            title="Add New Expense"
            isOpen={openAddExpenseModal}
            onClose={() => setOpenAddExpenseModal(false)}
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Expense Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
              />
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
              />

              {/* Icon picker */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pick an icon"
                  name="icon"
                  value={formData.icon}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  readOnly
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500 cursor-pointer"
                />
                {showEmojiPicker && (
                  <div className="absolute z-50 top-full mt-2">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>

              {/* Category */}
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>

              {/* Date */}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-red-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setOpenAddExpenseModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveExpense}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Save
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Dashboard>
  );
};

export default Expense;
