import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import IncomeList from "../components/IncomeList";
import Modal from "../components/Modal";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { toast } from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";
import IncomeOverview from "../components/IncomeOverview";

const Income = () => {
  useUser();

  const [incomeData, setIncomeData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    icon: "",
    date: "",
  });
  // Get all categories without filtering
  const getAllCategories = () => {
    return categories;
  };

  // Fetch incomes
  const fetchIncomeData = async () => {
    setLoading(true);
    try {
      const res = await axiosConfig.get(API_ENDPOINTS.GET_ALL_INCOME);
      if (res.status === 200) setIncomeData(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch incomes");
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

  const handleDownloadIncomeDetails = async () => {
    try {
      // Allow choosing format via prompt to keep same UI element
      const choice = (window.prompt("Export format: excel / pdf / csv", "excel") || "").toLowerCase();
      if (choice === "pdf") {
        const { downloadPdf } = await import("../util/exportClient");
        await downloadPdf();
        toast.success("Income PDF downloaded successfully");
        return;
      }
      if (choice === "csv") {
        const { downloadCsv } = await import("../util/exportClient");
        await downloadCsv();
        toast.success("Income CSV downloaded successfully");
        return;
      }
      // default to existing Excel
      const response = await axiosConfig.get(API_ENDPOINTS.INCOME_EXCEL_DOWNLOAD, { responseType: "blob" });
      let filename = "income_details.xlsx";
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully");
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error(error.response?.data?.message || "Failed to download income details");
    }
  };

  const handleEmailIncomeDetails = async () => {
    try {
      const response = await axiosConfig.get(API_ENDPOINTS.EMAIL_INCOME);
      if (response.status === 200) {
        toast.success("Email sent successfully");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error(error.response?.data?.message || "Failed to send email");
    }
  };

  useEffect(() => {
    fetchIncomeData();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmojiClick = (emojiData) => {
    setFormData({ ...formData, icon: emojiData.emoji });
    setShowEmojiPicker(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      categoryId: "",
      icon: "",
      date: "",
    });
    setEditingId(null);
  };

  const handleEdit = (income) => {
    setEditingId(income.id);
    setFormData({
      name: income.name,
      amount: income.amount.toString(),
      categoryId: income.categoryId,
      icon: income.icon || "",
      date: income.date,
    });
    setOpenAddIncomeModal(true);
  };

  const handleSaveIncome = async () => {
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

    if (!editingId) {
      const duplicate = incomeData.find(
        (i) => i.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (duplicate) {
        toast.error("Income with this name already exists");
        return;
      }
    }

    try {
      if (editingId) {
        // Update existing income
        const res = await axiosConfig.put(
          `${API_ENDPOINTS.UPDATE_INCOME}/${editingId}`,
          formData
        );
        if (res.status === 200) {
          toast.success("Income updated successfully!");
          fetchIncomeData();
          setOpenAddIncomeModal(false);
          resetForm();
        }
      } else {
        // Add new income
        const res = await axiosConfig.post(API_ENDPOINTS.ADD_INCOME, {
          ...formData,
          type: "income",
        });
        if (res.status === 201) {
          toast.success("Income added successfully!");
          fetchIncomeData();
          setOpenAddIncomeModal(false);
          resetForm();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save income");
    }
  };

  const handleDeleteIncome = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this income?");
    if (!confirmed) return;

    try {
      await axiosConfig.delete(`${API_ENDPOINTS.DELETE_INCOME}/${id}`);
      toast.success("Income deleted successfully");
      fetchIncomeData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete income");
    }
  };

  return (
    <Dashboard activeMenu="Income">
      <div className="m-5 mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-indigo-600">Income Dashboard</h2>
          <button
            onClick={() => {
              resetForm();
              setOpenAddIncomeModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow transition"
          >
            <Plus size={16} /> Add Income
          </button>
        </div>

        {/* Chart */}
        <IncomeOverview transactions={incomeData} />

        {/* Income List */}
        <IncomeList
          transactions={incomeData.map((i) => ({
            ...i,
            category: categories.find((c) => c.id === i.categoryId),
          }))}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onDelete={handleDeleteIncome}
          onEdit={handleEdit}
          onDownload={handleDownloadIncomeDetails}
          onEmail={handleEmailIncomeDetails}
        />

        {/* Add/Edit Income Modal */}
        {openAddIncomeModal && (
          <Modal
            title={editingId ? "Edit Income" : "Add New Income"}
            isOpen={openAddIncomeModal}
            onClose={() => {
              setOpenAddIncomeModal(false);
              resetForm();
            }}
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Income Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
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
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {getAllCategories().map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
              {/* Date */}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpenAddIncomeModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveIncome}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                >
                  {editingId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </Dashboard>
  );
};

export default Income;