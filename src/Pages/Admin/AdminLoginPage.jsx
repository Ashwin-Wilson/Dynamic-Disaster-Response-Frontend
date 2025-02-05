import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, ChevronLeft } from "lucide-react";

const AdminLoginPage = () => {
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

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[#0f172a] overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-red-500/20 rounded-full blur-[100px]"></div>
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
              <div className="p-3 bg-red-500/20 rounded-full backdrop-blur-sm mb-4">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Login</h1>
              <p className="text-gray-400 mt-2">
                System administrator access only
              </p>
            </div>

            {/* Login form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent 
                           placeholder-gray-500 backdrop-blur-sm transition-all"
                  placeholder="admin@example.com"
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent 
                           placeholder-gray-500 backdrop-blur-sm transition-all"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-red-500 focus:ring-red-500 bg-white/10"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-300 transition-colors"
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
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-3 px-4 
                         rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 
                         focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in to Dashboard"}
              </button>

              {/* Sign up link */}
              <p className="text-gray-400 text-center text-sm mt-4">
                Dont have an account?{" "}
                <Link
                  to="/Admin/signup"
                  className="text-red-400 hover:text-red-300 transition-colors font-medium"
                >
                  Sign up here
                </Link>
              </p>
            </form>
          </div>

          {/* Additional links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Need support?{" "}
              <a
                href="/contact"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
