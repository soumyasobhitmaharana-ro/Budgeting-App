import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useState } from "react";
import Input from "../components/Input";
import { validateEmail, validatePassword } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { AppContext } from "../context/AppContext";
import { LoaderCircle, Menu, X } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false); // NEW
  const [resetEmailSent, setResetEmailSent] = useState(false); // NEW

  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !password) {
      setError("Both fields are required!");
      setIsLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email address!");
      setIsLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 special symbol!"
      );
      setIsLoading(false);
      return;
    }
    try {
      const response = await axiosConfig.post(API_ENDPOINTS.LOGIN, { email, password });
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data?.message || "Invalid email or password");
      } else if (error.request) {
        setError("Server not responding. Please try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // NEW: Handle forgot password request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email to reset password.");
      setIsLoading(false);
      return;
    }
    try {
      await axiosConfig.post(API_ENDPOINTS.FORGOT_PASSWORD, { email });
      setResetEmailSent(true);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img
        src={assets.loginbg}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-cover scale-105 animate-slow-zoom -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/40 via-orange-200/40 to-violet-200/40 -z-10" />

      {/* Header */}
      <header className="flex justify-between items-center px-6 md:px-12 py-4 bg-white/20 backdrop-blur-md border-b border-white/40 shadow-lg relative z-20">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-wide drop-shadow animate-fade-in">
          💰 Money Manager
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4 md:space-x-6">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl text-gray-800 border border-gray-300 hover:bg-white/60 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-white bg-gradient-to-r from-orange-400 to-rose-500 shadow-md hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-800" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Slide-In Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white/90 backdrop-blur shadow-xl z-30 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col mt-20 space-y-6 px-6">
          <Link
            to="/"
            onClick={closeMenu}
            className="py-3 px-4 bg-indigo-100 rounded-xl text-indigo-700 font-semibold hover:bg-indigo-200 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            onClick={closeMenu}
            className="py-3 px-4 bg-orange-400/80 rounded-xl text-white font-semibold hover:bg-orange-500 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={closeMenu}
            className="py-3 px-4 bg-violet-500 rounded-xl text-white font-semibold hover:bg-violet-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/30 z-20" onClick={closeMenu}></div>}

      {/* Login/Forgot Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 transform animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2 tracking-wide">
            {forgotPasswordMode ? "Forgot Password ?" : "Welcome Back 👋"}
          </h2>
          {!forgotPasswordMode && (
            <p className="text-sm md:text-base text-gray-600 text-center mb-6">
              Login to continue managing your <span className="font-semibold text-rose-500">finances</span>
            </p>
          )}
          {forgotPasswordMode && !resetEmailSent && (
            <p className="text-sm md:text-base text-gray-600 text-center mb-6">
              Enter your email and we'll send a password reset link.
            </p>
          )}
          {forgotPasswordMode && resetEmailSent && (
            <p className="text-sm md:text-base text-green-600 text-center mb-6">
              Reset link sent! Check your email.
            </p>
          )}

          <form className="space-y-5" onSubmit={forgotPasswordMode ? handleForgotPassword : handleLoginSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(val) => {
                setEmail(val);
                setError("");
              }}
              placeholder="Enter your Email"
            />

            {!forgotPasswordMode && (
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  setError("");
                }}
                placeholder="Enter Password"
              />
            )}

            {error && (
              <p className={`text-sm text-center ${forgotPasswordMode ? "text-red-500" : "text-red-500"} animate-fade-in`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 md:py-4 rounded-2xl font-semibold shadow-lg transition-all duration-300 bg-gradient-to-r from-orange-400 via-rose-500 to-violet-500 text-white ${
                isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-5 w-5 animate-spin" />
                  {forgotPasswordMode ? "Sending..." : "Logging in..."}
                </span>
              ) : forgotPasswordMode ? "Send Reset Link" : "Login"}
            </button>
          </form>

          {!forgotPasswordMode && (
            <p className="mt-3 text-center text-sm md:text-base text-rose-500 hover:underline cursor-pointer" onClick={() => setForgotPasswordMode(true)}>
              Forgot Password?
            </p>
          )}

          {!forgotPasswordMode && (
            <p className="mt-6 text-center text-gray-700 text-sm md:text-base">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-rose-500 hover:underline hover:text-rose-600 transition"
              >
                Sign Up
              </Link>
            </p>
          )}

          {forgotPasswordMode && (
            <p
              className="mt-6 text-center text-gray-700 text-sm md:text-base hover:underline cursor-pointer"
              onClick={() => {
                setForgotPasswordMode(false);
                setResetEmailSent(false);
                setError("");
              }}
            >
              Back to Login
            </p>
          )}
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slow-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.05); } }
        .animate-fade-in { animation: fade-in 0.8s ease forwards; }
        .animate-slide-up { animation: slide-up 0.9s ease forwards; }
        .animate-slow-zoom { animation: slow-zoom 25s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default Login;
