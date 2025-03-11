import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, Lock } from "lucide-react";
import axios from "axios";

// Ashwin ji fix it port 800 tanne alle
const BASE_URL = import.meta.env.VITE_BASE_URL;

const FamilyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Initial validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required!");
      setIsLoading(false);
      return;
    }

    try {
      // Snd login request
      const response = await axios.post(`${BASE_URL}/family/login`, formData);

      if (response.data && response.data.token) {
        // Store token from response
        localStorage.setItem("token", response.data.token);

        localStorage.setItem("familyName", response.data.family.family_name);
        localStorage.setItem("familyEmail", formData.email);

        // Show success message
        console.log("Login successful:", response.data.message);

        // Navigate to dashboard
        navigate("/family/dashboard");
      } else {
        setError("Login failed: Authentication token not received");
      }
    } catch (error) {
      console.error("Login error details:", error);

      if (error.response) {
        // To Handle the deam errors hehe
        switch (error.response.status) {
          case 400:
            setError("Email and password are required!");
            break;
          case 401:
            setError("Invalid email or password");
            break;
          case 404:
            setError(
              "Server endpoint not found. Please check your connection."
            );
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(error.response.data?.message || "Login failed");
        }
      } else if (error.request) {
        setError(
          "Cannot connect to server. Please check your internet connection." +
            String(error.request)
        );
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[#0f172a] overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to home
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-4">
        <div className="w-full max-w-md">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm mb-4">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-gray-400 mt-2">Login to your family account</p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           placeholder-gray-500 backdrop-blur-sm transition-all"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           placeholder-gray-500 backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-blue-500 
                             focus:ring-blue-500 focus:ring-offset-gray-900"
                  />
                  <span className="ml-2 text-sm text-gray-300">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium py-3 px-4 
                         rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 
                         focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  "Signing in..."
                ) : (
                  <span className="flex items-center justify-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Sign in
                  </span>
                )}
              </button>

              {/* Sign up link */}
              <p className="text-gray-400 text-center text-sm">
                Dont have an account?{" "}
                <Link
                  to="/family/signup"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Create account
                </Link>
              </p>
            </form>
          </div>

          {/* Security notice */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">Contact us for support! </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FamilyLogin;
