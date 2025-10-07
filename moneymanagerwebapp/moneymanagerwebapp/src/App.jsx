import Category from "./pages/Category";
import Expense from "./pages/Expense";
import Filter from "./pages/Filter";
import Home from "./pages/Home";
import Income from "./pages/Income";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import IndexPage from "./pages/IndexPage";
import ResetPassword from "./pages/ResetPassword"; // <-- new
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <IndexPage />}
          />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/expense" element={<Expense />} />
          <Route path="/income" element={<Income />} />
          <Route path="/category" element={<Category />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/reset-password" element={<ResetPassword />} /> {/* <-- added */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
