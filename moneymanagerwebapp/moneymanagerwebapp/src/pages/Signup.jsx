import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
import Input from "../components/Input";
import { validateEmail, validatePassword } from "../util/validation";
import axiosConfig from "../util/axiosConfig";
import toast from "react-hot-toast";
import { LoaderCircle, Menu, X } from "lucide-react";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import ProfilePhotoSelector from "../components/ProfilePhotoSelector";
import uploadProfileImage from "../util/uploadProfileImage";

const Signup = () => { 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let profileImageUrl = "";
    setIsLoading(true);

    if (!fullName || !email || !password) {
      setError("All fields are required!");
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

    setError("");
    try {
      if (profilePhoto) {
        const imageUrl = await uploadProfileImage(profilePhoto);
        profileImageUrl = imageUrl || "";
      }

      const response = await axiosConfig.post(API_ENDPOINTS.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("Signup successful!");
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError(error.response?.data?.message || "Something went wrong!");
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <img
          src={assets.signup}
          alt="Signup Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-indigo-800/30 to-pink-800/30"></div>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center px-6 sm:px-8 md:px-12 py-4 relative z-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
          💰 Money Manager
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-3 sm:space-x-5">
          <Link
            to="/"
            className="px-3 py-1 rounded-lg text-white border border-white/40 hover:bg-white/20 transition"
          >
            Home
          </Link>
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white shadow-lg hover:scale-105 transition-transform"
          >
            Sign Up
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleMenu}>
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
            className="py-3 px-4 bg-indigo-500/80 rounded-xl text-white font-semibold hover:bg-indigo-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={closeMenu}
            className="py-3 px-4 bg-pink-500/80 rounded-xl text-white font-semibold hover:bg-pink-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20"
          onClick={closeMenu}
        ></div>
      )}

      {/* Signup Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-12 transform animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Create Your Account
          </h2>
          <p className="text-gray-200 text-center mb-8">
            Track your <span className="text-pink-300 font-semibold">finances</span> easily
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center space-y-3">
              <label className="text-white font-medium text-sm sm:text-base">
                Profile Photo
              </label>
              <ProfilePhotoSelector image={profilePhoto} setImage={setProfilePhoto} />
            </div>

            <Input
              label="Full Name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter Full Name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your Email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter Password"
            />

            {error && (
              <p className="text-red-400 text-center text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:scale-[1.02] transition-all duration-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoaderCircle className="h-5 w-5 animate-spin" /> Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-200">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-900 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>

      {/* Animations */}
      <style>
        {`
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-up { animation: slide-up 0.9s ease forwards; }
        `}
      </style>
    </div>
  );
};

export default Signup;
