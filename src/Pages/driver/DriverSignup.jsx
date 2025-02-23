import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Car, MapPin } from "lucide-react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverSignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    driver_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contact_info: {
      phone: "",
      alternate_phone: "",
    },
    vehicle: {
      type: "",
      registration_number: "",
    },

    availability: true,
    driving_experience: {
      license: {
        number: "",
        valid_from: "",
        valid_until: "",
      },
    },
    vehicle_condition: {
      fuel_status: "",
      capacity: {
        passengers: 0,
        weight_limit: 0,
      },
    },
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCapacityChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      vehicle_condition: {
        ...prev.vehicle_condition,
        capacity: {
          ...prev.vehicle_condition.capacity,
          [name]: parseInt(value) || 0,
        },
      },
    }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          setError("Error getting location: " + error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/driver/signup`, {
        driver_name: formData.driver_name,
        email: formData.email,
        password: formData.password,
        contact_info: formData.contact_info,
        vehicle: formData.vehicle,
        available: formData.availability,
        location: { coordinates: location },
        driving_experience: formData.driving_experience,
        vehicle_condition: formData.vehicle_condition,
      });

      localStorage.setItem("driverToken", response.data.token);
      localStorage.setItem("driverName", formData.driver_name);
      localStorage.setItem(
        "driverVehicleNum",
        formData.vehicle.registration_number
      );

      navigate("/driver/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during signup"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col relative bg-[#0f172a] overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-yellow-500/20 rounded-full blur-[100px]"></div>
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
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-yellow-500/20 rounded-full backdrop-blur-sm mb-4">
                <Car className="text-yellow-500 w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Driver Registration
              </h1>
              <p className="text-gray-400 mt-2">Create your driver account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 ">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">
                  Personal Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    name="driver_name"
                    type="text"
                    required
                    value={formData.driver_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="contact_info.phone"
                    type="tel"
                    required
                    value={formData.contact_info.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alternate Phone (Optional)
                  </label>
                  <input
                    name="contact_info.alternate_phone"
                    type="tel"
                    value={formData.contact_info.alternate_phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Alternative phone number"
                  />
                </div>
              </div>
              {/* Vehicle Details Section */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">
                  Vehicle Details
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    name="vehicle.type"
                    required
                    value={formData.vehicle.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm transition-all"
                  >
                    <option value="" className="bg-gray-600 text-white">
                      Select vehicle type
                    </option>
                    <option value="car" className="bg-gray-600 text-white">
                      Car
                    </option>
                    <option value="suv" className="bg-gray-600 text-white">
                      SUV
                    </option>
                    <option value="van" className="bg-gray-600 text-white">
                      Van
                    </option>
                    <option value="truck" className="bg-gray-600 text-white">
                      Truck
                    </option>
                    <option value="other" className="bg-gray-600 text-white">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Registration Number
                  </label>
                  <input
                    name="vehicle.registration_number"
                    type="text"
                    required
                    value={formData.vehicle.registration_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Enter vehicle registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fuel status
                  </label>
                  <select
                    name="vehicle_condition.fuel_status"
                    required
                    value={formData.vehicle_condition.fuel_status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent backdrop-blur-sm transition-all"
                  >
                    <option value="" className="bg-gray-600 text-white">
                      Select fuel status
                    </option>
                    <option value="full" className="bg-gray-600 text-white">
                      Full
                    </option>
                    <option value="partial" className="bg-gray-600 text-white">
                      Partial
                    </option>
                    <option value="empty" className="bg-gray-600 text-white">
                      Empty
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Passenger Capacity
                  </label>
                  <input
                    name="passengers"
                    type="number"
                    required
                    value={formData.vehicle_condition.capacity.passengers}
                    onChange={handleCapacityChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Number of passengers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight Limit (kg)
                  </label>
                  <input
                    name="weight_limit"
                    type="number"
                    required
                    value={formData.vehicle_condition.capacity.weight_limit}
                    onChange={handleCapacityChange}
                    min="0"
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="Maximum weight capacity"
                  />
                </div>
              </div>
              {/* Driving Experience */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">
                  Driving Experience
                </h3>

                <label className="block text-gray-200 mb-2">
                  License number
                </label>
                <input
                  name="driving_experience.license.number"
                  type="text"
                  required
                  value={formData.driving_experience.license.number}
                  // onChange={handleChange}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      driving_experience: {
                        license: {
                          ...formData.driving_experience.license,
                          number: e.target.value,
                        },
                      },
                    });
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                  placeholder="License number"
                />

                <label className="block text-gray-200 mb-2">Valid from</label>
                <input
                  type="date"
                  name="driving_experience.license.valid_from"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                  value={formData.driving_experience.license.valid_from}
                  // onChange={handleChange}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      driving_experience: {
                        license: {
                          ...formData.driving_experience.license,
                          valid_from: e.target.value,
                        },
                      },
                    });
                  }}
                />
                <label className="block text-gray-200 mb-2">Valid until</label>
                <input
                  type="date"
                  name="driving_experience.license.valid_until"
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-md p-2 text-white"
                  value={formData.driving_experience.license.valid_until}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      driving_experience: {
                        license: {
                          ...formData.driving_experience.license,
                          valid_until: e.target.value,
                        },
                      },
                    });
                  }}
                  // onChange={handleChange}
                />
              </div>

              {/* Location Section */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Location</h3>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="w-full flex items-center justify-center space-x-2 bg-white/10 border border-gray-600 text-white py-3 px-4 rounded-lg hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Get My Location</span>
                </button>
                {location && (
                  <p className="text-green-400 text-sm">
                    Location captured successfully!
                  </p>
                )}
              </div>
              {/* Availablility */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="basic-checkbox" />
                <label className=" text-sm text-gray-300 mb-2">
                  Are you avilable now?
                </label>
              </div>
              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-white text-lg font-medium">Security</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Driver Account"}
              </button>
              <p className="text-gray-400 text-center text-sm">
                Already have an account?{" "}
                <Link
                  to="/driver/login"
                  className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
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
                className="text-yellow-400 hover:text-yellow-300 transition-colors"
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

export default DriverSignupPage;
