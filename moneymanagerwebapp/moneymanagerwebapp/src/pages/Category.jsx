import { Plus, Smile, Edit2 } from "lucide-react";
import Dashboard from "../components/Dashboard";
import useUser from "../hooks/useUser";
import CategoryList from "../components/CategoryList";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import axiosConfig from "../util/axiosConfig";
import { toast } from "react-hot-toast";
import Modal from "../components/Modal";
import EmojiPicker from "emoji-picker-react";

const Category = () => {
  useUser();
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form state
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    icon: "",
    type: "Income",
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // 🔄 Fetch Categories
  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    } catch (error) {
      console.error("Error fetching category details:", error);
      toast.error("Error fetching category details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryDetails();
  }, []);

  // ➕ Open Add Modal
  const handleAddCategory = () => {
    setCategoryForm({ name: "", icon: "", type: "Income" });
    setShowEmojiPicker(false);
    setOpenAddCategoryModal(true);
  };

  // ✏️ Open Edit Modal
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      name: category.name || "",
      icon: category.icon || "",
      type: category.type || "Income",
    });
    setShowEmojiPicker(false);
    setOpenEditCategoryModal(true);
  };

  // ✅ Save New Category
  // ✅ Save New Category
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // 🔍 Check if category already exists
    const isExist = categoryData.some(
      (cat) => cat.name.toLowerCase() === categoryForm.name.trim().toLowerCase()
    );
    if (isExist) {
      toast.error("Category already exists");
      return;
    }

    try {
      const response = await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY, {
        name: categoryForm.name.trim(),
        icon: categoryForm.icon.trim(),
        type: categoryForm.type,
      });

      if (response.status === 201 || response.status === 200) {
        toast.success("Category added successfully!");
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  // ✅ Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // 🔍 Check if updated name conflicts with other categories
    const isExist = categoryData.some(
      (cat) =>
        cat.id !== selectedCategory.id &&
        cat.name.toLowerCase() === categoryForm.name.trim().toLowerCase()
    );
    if (isExist) {
      toast.error("Category already exists");
      return;
    }

    try {
      const response = await axiosConfig.put(
        `${API_ENDPOINTS.EDIT_CATEGORY}/${selectedCategory.id}`,
        {
          name: categoryForm.name.trim(),
          icon: categoryForm.icon.trim(),
          type: categoryForm.type,
        }
      );

      if (response.status === 200) {
        toast.success("Category updated successfully!");
        setOpenEditCategoryModal(false);
        setSelectedCategory(null);
        fetchCategoryDetails();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category");
    }
  };

  // ❌ Delete Category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await axiosConfig.delete(
        `${API_ENDPOINTS.DELETE_CATEGORY}/${categoryId}`
      );
      toast.success("Category deleted successfully!");
      fetchCategoryDetails();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <Dashboard activeMenu="Category">
      <div className="m-5 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">All Categories</h2>
          <button
            onClick={handleAddCategory}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md transition"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Category</span>
          </button>
        </div>

        {/* Category List */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <p className="text-gray-500 animate-pulse">Loading categories...</p>
          </div>
        ) : (
          <CategoryList
            categories={categoryData}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        )}

        {/* Add Category Modal */}
        {openAddCategoryModal && (
          <Modal
            title="Add New Category"
            isOpen={openAddCategoryModal}
            onClose={() => setOpenAddCategoryModal(false)}
          >
            <form className="space-y-4" onSubmit={handleSaveCategory}>
              <CategoryForm
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
              />
              <ModalButtons
                onCancel={() => setOpenAddCategoryModal(false)}
                submitLabel="Save"
              />
            </form>
          </Modal>
        )}

        {/* Edit Category Modal */}
        {openEditCategoryModal && selectedCategory && (
          <Modal
            title="Edit Category"
            isOpen={openEditCategoryModal}
            onClose={() => setOpenEditCategoryModal(false)}
          >
            <form className="space-y-4" onSubmit={handleUpdateCategory}>
              <CategoryForm
                categoryForm={categoryForm}
                setCategoryForm={setCategoryForm}
                showEmojiPicker={showEmojiPicker}
                setShowEmojiPicker={setShowEmojiPicker}
              />
              <ModalButtons
                onCancel={() => setOpenEditCategoryModal(false)}
                submitLabel="Update"
              />
            </form>
          </Modal>
        )}
      </div>
    </Dashboard>
  );
};

// Reusable form fields component
const CategoryForm = ({
  categoryForm,
  setCategoryForm,
  showEmojiPicker,
  setShowEmojiPicker,
}) => (
  <>
    {/* Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Name</label>
      <input
        type="text"
        placeholder="Category Name"
        value={categoryForm.name}
        onChange={(e) =>
          setCategoryForm({ ...categoryForm, name: e.target.value })
        }
        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    {/* Icon with Emoji Picker */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Icon</label>
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          placeholder="Pick an emoji"
          value={categoryForm.icon}
          readOnly
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="absolute right-2 top-2"
        >
          <Smile size={20} />
        </button>
        {showEmojiPicker && (
          <div className="absolute z-50 top-12 left-0">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setCategoryForm({ ...categoryForm, icon: emojiData.emoji })
              }
            />
          </div>
        )}
      </div>
    </div>

    {/* Type */}
    <div>
      <label className="block text-sm font-medium text-gray-700">Type</label>
      <select
        value={categoryForm.type}
        onChange={(e) =>
          setCategoryForm({ ...categoryForm, type: e.target.value })
        }
        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
      >
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>
    </div>
  </>
);

// Reusable buttons
const ModalButtons = ({ onCancel, submitLabel }) => (
  <div className="flex justify-end gap-2">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
    >
      {submitLabel}
    </button>
  </div>
);

export default Category;
