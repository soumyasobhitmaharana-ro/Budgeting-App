import { useContext } from "react";
import Menubar from "./Menubar";
import Sidebar from "./Sidebar";
import { AppContext } from "../context/AppContext";

const Dashboard = ({ children, activeMenu }) => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <Menubar activeMenu={activeMenu} />

      {user && (
        <div className="flex flex-1">
          {/* Sidebar (hidden on small screens) */}
          <div className="hidden lg:block w-64 bg-white shadow-md border-r">
            <Sidebar activeMenu={activeMenu} />
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
