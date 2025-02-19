import { useState } from "react";
import {
  Bell,
  Settings,
  LogOut,
  MapPin,
  AlertTriangle,
  Navigation2,
  Building2,
  Users,
  Truck,
  Ambulance,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const VolunteerPage = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  const [shelters] = useState([
    {
      id: 1,
      name: "Central Community Adoor",
      capacity: "234/500",
      volunteers: 6,
      status: "Available",
    },
    {
      id: 2,
      name: "East District School",
      capacity: "100/100",
      volunteers: 6,
      status: "Unavailable",
    },
    {
      id: 3,
      name: "Holycross Hospital",
      capacity: "259/350",
      volunteers: 12,
      status: "Available",
    },
  ]);

  const [alerts] = useState([
    {
      id: 1,
      type: "Disaster",
      location: "North District",
      description: "Flooding reported in low-lying areas",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "Route Blockage",
      location: "Main Street Bridge",
      description: "Road blocked due to fallen trees",
      time: "10 minutes ago",
    },
    {
      id: 3,
      type: "Disaster",
      location: "East Zone",
      description: "Power outage affecting multiple blocks",
      time: "15 minutes ago",
    },
    {
      id: 4,
      type: "Route Blockage",
      location: "Highway Junction",
      description: "Traffic congestion due to accident",
      time: "25 minutes ago",
    },
    {
      id: 5,
      type: "Disaster",
      location: "South District",
      description: "Gas leak reported in residential area",
      time: "30 minutes ago",
    },
  ]);

  const stats = [
    {
      title: "Total Evacuee",
      count: "932",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Volunteers",
      count: "478",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Shelters",
      count: "57",
      icon: Building2,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Ambulances",
      count: "57",
      icon: Ambulance,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Drivers",
      count: "34",
      icon: Truck,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      {/* Header */}
      <header className="bg-[#1e2538] p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-green-500 w-8 h-8" />
            <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
            <LogOut
              className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#1e2538] rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Volunteer Info & Status */}
          <div className="space-y-6">
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#1a1f2e]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Sarath Sashi</h2>
                  <p className="text-gray-400">ID: VOL-2024-001</p>
                  <p className="text-gray-400">Area: North idukki</p>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isActive
                        ? "bg-green-500/20 text-green-500"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {isActive ? "Active" : "Offline"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-red-500/10 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-500/20 transition-colors">
                  Report Disaster
                </button>
                <button className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-500/20 transition-colors">
                  Report Route Blockage
                </button>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border border-gray-700 rounded-lg p-4 hover:border-red-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <h4 className="font-semibold text-red-500">
                            {alert.type}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          {alert.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Map */}
          <div className="lg:col-span-2 bg-[#1e2538] rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Area Map</h3>
              <button className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors">
                <Navigation2 className="w-4 h-4" />
                Navigate
              </button>
            </div>
            {/* Placeholder for map */}
            <div className="relative h-[400px] bg-gray-800 rounded-lg overflow-hidden">
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L100,100 M100,0 L0,100"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="0.5"
                />
                <circle cx="30" cy="40" r="2" fill="#4CAF50" />
                <circle cx="70" cy="60" r="2" fill="#F44336" />
                <path
                  d="M30,40 Q50,50 70,60"
                  stroke="#FFD700"
                  strokeWidth="0.5"
                  fill="none"
                />
              </svg>
              <div className="absolute bottom-4 right-4 bg-[#1a1f2e] p-3 rounded-lg shadow-lg">
                <p className="text-sm">Active Volunteers: 12</p>
                <p className="text-xs text-gray-400">In your area</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shelters List */}
        <div className="mt-6">
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Active Shelters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shelters.map((shelter) => (
                <div
                  key={shelter.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-green-500/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{shelter.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{shelter.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span>{shelter.volunteers} volunteers</span>
                        </div>
                      </div>
                      <span
                        className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                          shelter.status === "Available"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {shelter.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerPage;
