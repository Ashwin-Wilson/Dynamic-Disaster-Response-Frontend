import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, ChevronLeft, MapPin } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FamilySignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [totalMembers, setTotalMembers] = useState("1");
  const [error, setError] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!coordinates) {
      setError("Please get your location before signing up.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/family/signup`, {
        family_name: username,
        email,
        password,
        role: "family",
        total_members: totalMembers,
        address: {
          street,
          city,
          state,
          pincode,
          location: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude],
          },
        },
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("familyName", username);
      localStorage.setItem("familyEmail", email);
      navigate("/family/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = (e) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError("Unable to retrieve your location");
      }
    );
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
      <main className="flex-1 flex items-center justify-center relative z-10 px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Glass card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-blue-500/20 rounded-full backdrop-blur-sm mb-4">
                <User className="w-8 h-8 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Family Registration
              </h1>
              <p className="text-gray-400 mt-2">
                Create your family account for disaster response
              </p>
            </div>

            {/* Signup form */}
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Basic Information Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Family Name
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Enter family name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                             placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {/* Total Members */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Family Members
                </label>
                <select
                  value={totalMembers}
                  onChange={(e) => setTotalMembers(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                           placeholder-gray-500 backdrop-blur-sm transition-all"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-gray-800">
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    Location Details
                  </label>
                  <button
                    onClick={getLocation}
                    className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg
                             hover:bg-blue-500/30 transition-colors focus:outline-none focus:ring-2 
                             focus:ring-blue-500"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Current Location
                  </button>
                </div>

                {coordinates && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-500/10 rounded-lg">
                    <div className="text-gray-300">
                      <span className="text-sm">Latitude:</span>
                      <p className="font-mono">{coordinates.latitude}</p>
                    </div>
                    <div className="text-gray-300">
                      <span className="text-sm">Longitude:</span>
                      <p className="font-mono">{coordinates.longitude}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Street
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter street address"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                               placeholder-gray-500 backdrop-blur-sm transition-all"
                      placeholder="Enter pincode"
                      required
                    />
                  </div>
                </div>
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
                {isLoading ? "Creating Account..." : "Create Family Account"}
              </button>

              {/* Login link */}
              <p className="text-gray-400 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/family/login"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign in here
                </Link>
              </p>
            </form>
          </div>

          {/* Additional links */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Need help?{" "}
              <a
                href="/contact"
                className="text-blue-400 hover:text-blue-300 transition-colors"
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

export default FamilySignUp;
