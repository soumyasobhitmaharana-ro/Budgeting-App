import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // optional icon library

const Input = ({ label, value, onChange, placeholder, type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-200 mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)} // ✅ always passes string
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-12 rounded-lg 
                     bg-white/80 text-gray-900 
                     border border-gray-300 
                     placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400
                     transition-all duration-200"
        />

        {isPassword && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()} // prevent input blur
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-500 z-10"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
