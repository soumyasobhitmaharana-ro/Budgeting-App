import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, Upload, User, X } from "lucide-react";
import { toast } from "react-toastify";

import { AppContext } from "../context/AppContext";
import Sidebar from "./Sidebar";
import { assets } from "../assets/assets";
import uploadProfileImage from "../util/uploadProfileImage";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";

const Menubar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const dropdownRef = useRef(null);

  const { user, setUser, clearUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Initialize currentImage with user's profile image
  useEffect(() => {
    setCurrentImage(user?.profileImageUrl || null);
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    setShowDropdown(false);
    navigate("/login");
  };

  // Profile photo change handler
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setCurrentImage(localUrl);

    try {
      const imageUrl = await uploadProfileImage(file);

      const response = await axiosConfig.put(
        API_ENDPOINTS.UPDATE_PROFILE_IMAGE,
        {
          userId: user.id,
          profileImageUrl: imageUrl,
        }
      );

      if (response.status === 200) {
        setUser(response.data); // update context
        setCurrentImage(response.data.profileImageUrl); // finalize image

        // Show UI success message
        setSuccessMessage("Profile Updated Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000); // hide after 3s
      }
    } catch (err) {
      toast.error("Failed to update profile photo!");
      console.error(err);
      setCurrentImage(user?.profileImageUrl || null);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 shadow-lg">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpenSideMenu(!openSideMenu)}
          className="block lg:hidden text-white hover:bg-white/20 p-2 rounded-md transition"
        >
          {openSideMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => navigate("/dashboard")}
        >
          <img
            src={assets.logo}
            alt="logo"
            className="h-10 w-10 rounded-full shadow-md border border-white/30"
          />
          <span className="text-lg font-semibold text-white tracking-wide">
            Money Manager
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition focus:outline-none focus:ring-2 focus:ring-white"
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border border-white/30"
            />
          ) : (
            <User className="text-white w-5 h-5" />
          )}
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="absolute right-0 mt-12 w-56 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-md shadow-md z-50">
            {successMessage}
          </div>
        )}

        {showDropdown && (
          <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
            {/* User Info */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-9 h-9 bg-purple-100 rounded-full overflow-hidden">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt="Profile"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <User className="text-purple-600 w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Dropdown Options */}
            <div className="py-1">
              <label
                htmlFor="profilePhotoInput"
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-800">Change Photo</span>
              </label>
              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileChange}
              />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition"
              >
                <LogOut className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-800">Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Side Menu */}
      {openSideMenu && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-72 h-full bg-white shadow-lg p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setOpenSideMenu(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Menubar;
