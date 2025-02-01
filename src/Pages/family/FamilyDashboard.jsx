import { useState } from "react";
import { Bell, LogOut, User, Grid, MapPin, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserDataForm from "./UserDataForm";

const FamilyDashboard = () => {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const shelters = [
    {
      name: "Centeral Community Adoor",
      capacity: "234/500",
      distance: 6,
      status: "Available",
    },
    {
      name: "East District School",
      capacity: "100/100",
      distance: 6,
      status: "Unavailable",
    },
    {
      name: "Holycross Hospital",
      capacity: "259/350",
      distance: 12,
      status: "Available",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl text-gray-200">User Dashboard</h1>
        </div>

        <LogOut
          className="w-6 h-6 text-gray-400 cursor-pointer"
          onClick={() => {
            console.log("Admin login clicked");
            navigate("/");
          }}
        />
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <h2 className="text-gray-200 text-lg">Vipin</h2>
            <p className="text-gray-400 text-sm">example@gmail.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <button className="flex items-center space-x-3 text-gray-300 hover:text-gray-100">
            <Grid className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-3 text-gray-300 hover:text-gray-100">
            <User className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-blue-500" />
            <h3 className="text-gray-200 text-lg">Nearby Shelters Route</h3>
          </div>
          <p className="text-gray-400">Find safe location near you</p>
        </div>

        <div
          className="bg-slate-800/50 rounded-lg p-6 cursor-pointer"
          onClick={() => setIsFormOpen(true)}
        >
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-gray-200 text-lg">Report Disaster</h3>
          </div>
          <p className="text-gray-400">Report incidents in your area</p>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-500" />
            <h3 className="text-gray-200 text-lg">Notifications</h3>
          </div>
          <p className="text-gray-400">Stay updated with alerts</p>
        </div>
      </div>

      {/* Available Shelters Section */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h2 className="text-gray-200 text-xl mb-4">Available Shelters</h2>
        <div className="space-y-4">
          {shelters.map((shelter, index) => (
            <div key={index} className="bg-slate-800/80 rounded-lg p-4">
              <h3 className="text-gray-200 mb-3">{shelter.name}</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-400">{shelter.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-gray-400">{shelter.distance}</span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    shelter.status === "Available"
                      ? "text-green-500 bg-green-500/10"
                      : "text-gray-400 bg-gray-500/10"
                  }`}
                >
                  {shelter.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Data Form Modal */}
      <UserDataForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
};

export default FamilyDashboard;
