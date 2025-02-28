import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShelterManagementForm from "../../Components/ShelterUpdateForm";
import axios from "axios";
import {
  Building2,
  Users,
  Clipboard,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
  HeartPulse,
  Bed,
  Package,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);

  // Format date: Month Day, Year
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format time: Hours:Minutes AM/PM
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${formattedDate} at ${formattedTime}`;
}

const CareTakerDashboard = () => {
  const [viewShlterUpdateForm, setViewShlterUpdateForm] = useState(false);
  const [shelterId, setShelterId] = useState(localStorage.getItem("shelterId"));

  const navigate = useNavigate();
  // const [shelterStats] = useState({
  //   occupancy: "234/500",
  //   supplies: "85%",
  //   sanitationStatus: "Good",
  //   lastInspection: "2 hours ago",
  // });

  const [shelterDetails, setShelterDetails] = useState({
    shelter_name: "Federal Shelter",
    address: {
      street: "Idukki",
      city: "Idukki",
      state: "Kerala",
      postal_code: "1234556",
      location: {
        coordinates: [76.9554446372482, 9.85038951939373],
        type: "Point",
      },
    },
    capacity: {
      max_capacity: 500,
      current_occupancy: 250,
      available_beds: 296,
    },
    medical_cases: { count: 0, details: [] },
    supply_status: {
      food: 100,
      water: 100,
      medicine: 100,
      other_supplies: 100,
    },
    sanitation: "good",
    last_inspection: "2025-02-28T07:30:19.521Z",
    status: "active",
  });

  const [dailyReports] = useState([
    {
      id: 1,
      date: "2024-03-20",
      time: "08:00 AM",
      type: "Morning Inspection",
      status: "Completed",
      notes:
        "All facilities functioning properly. Breakfast distributed on time.",
    },
    {
      id: 2,
      date: "2024-03-20",
      time: "02:00 PM",
      type: "Supply Check",
      status: "Attention Needed",
      notes: "Medical supplies running low. Request for resupply submitted.",
    },
    {
      id: 3,
      date: "2024-03-20",
      time: "07:00 PM",
      type: "Evening Report",
      status: "Completed",
      notes: "Two new families checked in. All residents accounted for.",
    },
  ]);

  const stats = [
    {
      title: "Total Occupants",
      count: `${shelterDetails.capacity.current_occupancy}`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Medical Cases",
      count: `${shelterDetails.medical_cases.count}`,
      icon: HeartPulse,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Available Beds",
      count: `${shelterDetails.capacity.available_beds}`,
      icon: Bed,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Supply Status",
      count: ` ${
        (shelterDetails.supply_status.food +
          shelterDetails.supply_status.water +
          shelterDetails.supply_status.medicine +
          shelterDetails.supply_status.other_supplies) /
        4
      }
                    %`,
      icon: Package,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  useEffect(() => {
    if (shelterId) {
      axios
        .get(`${BASE_URL}/caretaker/shelter`, {
          headers: { shelterId: shelterId },
        })
        .then((response) => {
          setShelterDetails(response.data.shelter);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [shelterId]);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      {/* Header */}
      <header className="bg-[#1e2538] p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Building2 className="text-purple-500 w-8 h-8" />
            <h1 className="text-2xl font-bold">Shelter Caretaker Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-400 hover:text-purple-500 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-purple-500 cursor-pointer" />
            <LogOut
              onClick={handleLogout}
              className="w-6 h-6 text-gray-400 hover:text-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          {/* Caretaker Profile */}
          <div className="space-y-6">
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-[#1a1f2e]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {localStorage.getItem("caretakerName") ?? "Thomas"}
                  </h2>
                  <p className="text-gray-400">ID: CT-2024-001</p>
                  <p className="text-gray-400">Central Community Shelter</p>
                  <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-500">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    On Duty
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold mb-2">Qualifications</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✓ First Aid Certified</p>
                    <p>✓ Crowd Management Training</p>
                    <p>✓ Mental Health First Aid</p>
                    <p>✓ Multilingual (English, Spanish)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-purple-500/10 text-purple-500 py-2 rounded-lg font-semibold hover:bg-purple-500/20 transition-colors">
                  Submit Daily Report
                </button>
                <button
                  className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-500/20 transition-colors"
                  onClick={() => {
                    setViewShlterUpdateForm(!viewShlterUpdateForm);
                  }}
                >
                  Update Shelter Details
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shelter Status */}
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Shelter Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">Occupancy</p>
                  <p className="text-xl font-bold">
                    {shelterDetails.capacity.current_occupancy}/
                    {shelterDetails.capacity.max_capacity}
                  </p>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">Supplies</p>
                  <p className="text-xl font-bold">
                    {(shelterDetails.supply_status.food +
                      shelterDetails.supply_status.water +
                      shelterDetails.supply_status.medicine +
                      shelterDetails.supply_status.other_supplies) /
                      4}
                    %
                  </p>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">Sanitation</p>
                  <p className="text-xl font-bold">
                    {shelterDetails.sanitation}
                  </p>
                </div>
                <div className="p-4 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">Last Inspection</p>
                  <p className="text-xl font-bold">
                    {formatDateTime(shelterDetails.last_inspection)}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Reports */}
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Daily Reports</h3>
              <div className="space-y-4">
                {dailyReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-700 rounded-lg p-4 hover:border-purple-500/50"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Clipboard className="w-4 h-4 text-purple-500" />
                          <h4 className="font-semibold">{report.type}</h4>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span>{report.date}</span>
                          <span>{report.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-2">
                          {report.notes}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          report.status === "Completed"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      {viewShlterUpdateForm === true && (
        <ShelterManagementForm
          onClose={() => setViewShlterUpdateForm(false)}
          shelterId={shelterId}
          isUpdate={shelterId ? true : false}
        />
      )}
    </div>
  );
};

export default CareTakerDashboard;
