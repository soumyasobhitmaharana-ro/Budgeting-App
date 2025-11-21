import Category from "./pages/Category";
import Expense from "./pages/Expense";
import Filter from "./pages/Filter";
import Home from "./pages/Home";
import Income from "./pages/Income";
import Community from "./pages/Community";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import IndexPage from "./pages/IndexPage";
import ResetPassword from "./pages/ResetPassword";
import Budgets from "./pages/Budgets";
import SavingsGoals from "./pages/SavingsGoals";
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
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<SavingsGoals />} />
          <Route path="/community" element={<Community />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
