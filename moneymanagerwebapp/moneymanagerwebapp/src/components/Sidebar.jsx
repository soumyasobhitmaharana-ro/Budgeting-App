import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { User } from "lucide-react";
import { SIDE_BAR_DATA } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeMenu}) => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="w-64 h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-5 sticky top-[61px] z-20 flex flex-col">
      {/* Profile Section */}
      <div className="flex flex-col items-center gap-3 mt-3 mb-8">
        {user?.profileImageUrl ? (
          <img
            src={user?.profileImageUrl}
            alt="Profile"
            className="w-16 h-16 rounded-full shadow-md border-2 border-purple-500"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
        )}

        <h2 className="text-lg font-semibold text-gray-800">
          {user?.fullName}
        </h2>
      </div>

      {/* Menu Section */}
      <div className="flex flex-col gap-2">
        {SIDE_BAR_DATA.map((item, index) => (
          <button
            onClick={() => navigate(item.path)}
            key={`menu_${index}`}
            className={`cursor-pointer flex items-center gap-3 py-2.5 px-4 rounded-lg text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-all duration-200 ${activeMenu === item.label ? "bg-gradient-to-r from-purple-100 to-indigo-100" : ""}`}
          >
            <item.icon className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
