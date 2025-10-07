import React, { useState, useMemo } from "react";
import { Pencil, Trash2, Search } from "lucide-react";

const CategoryList = ({ categories = [], onEditCategory, onDeleteCategory }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.icon && cat.icon.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [categories, searchTerm]);

  const typeColor = (type) => {
    switch (type.toLowerCase()) {
      case "income":
        return "bg-green-100 text-green-700";
      case "expense":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative w-full sm:w-1/2 mb-2">
        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search categories..."
          className="pl-10 pr-4 py-2 border rounded-full w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Category Source Label */}
      <h2 className="text-lg font-semibold text-gray-800">Category Source</h2>

      {/* All Categories Container */}
      <div className="bg-white p-5 rounded-2xl shadow-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="relative group bg-gray-50 shadow-md rounded-xl p-4 flex flex-col items-center text-center transition transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              {/* Icon */}
              <div
                className={`text-3xl w-14 h-14 flex items-center justify-center rounded-full mb-2 ${typeColor(
                  category.type
                )}`}
              >
                {category.icon || "❓"}
              </div>

              {/* Name */}
              <h3 className="text-md font-semibold text-gray-900 truncate">{category.name}</h3>

              {/* Type */}
              <p className="text-xs text-gray-500">{category.type}</p>

              {/* Edit/Delete buttons (hover) */}
              <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                  title="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center col-span-full py-8 text-gray-500 text-sm">
            No categories available
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
