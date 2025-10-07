import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Input from "../components/Input";
import axiosConfig from "../util/axiosConfig";
import { API_ENDPOINTS } from "../util/apiEndpoints";
import { LoaderCircle } from "lucide-react";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // get token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validatePasswordStrength = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(pwd);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validatePasswordStrength(password)) {
      setError("Password must be at least 8 characters, include 1 uppercase letter and 1 special symbol!");
      return;
    }

    setIsLoading(true);
    try {
      await axiosConfig.post(API_ENDPOINTS.RESET_PASSWORD, {
        token,
        password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/40 via-orange-200/40 to-violet-200/40 -z-10" />

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 transform animate-slide-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-2 tracking-wide">
            Reset Password 🔒
          </h2>

          {!success && (
            <p className="text-sm md:text-base text-gray-600 text-center mb-6">
              Enter your new password below.
            </p>
          )}

          {success && (
            <p className="text-green-600 text-center text-base mb-6">
              Password reset successfully! You can now{" "}
              <Link to="/login" className="text-rose-500 hover:underline">
                login
              </Link>.
            </p>
          )}

          {!success && (
            <form className="space-y-5" onSubmit={handleReset}>
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(val) => {
                  setPassword(val);
                  setError("");
                }}
                placeholder="Enter new password"
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  setError("");
                }}
                placeholder="Confirm password"
              />

              {error && <p className="text-red-500 text-sm text-center animate-fade-in">{error}</p>}

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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          )}

          {!success && (
            <p className="mt-6 text-center text-gray-700 text-sm md:text-base hover:underline cursor-pointer">
              <Link to="/login">Back to Login</Link>
            </p>
          )}
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease forwards; }
        .animate-slide-up { animation: slide-up 0.9s ease forwards; }
      `}</style>
    </div>
  );
};

export default ResetPassword;
