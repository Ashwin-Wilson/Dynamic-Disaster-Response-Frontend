import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, X } from "lucide-react";
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
  const [viewDailyReportForm, setViewDailyReportForm] = useState(false);
  const [shelterId, setShelterId] = useState(null);
  const [caretakerId, setCaretakerId] = useState(
    localStorage.getItem("caretakerId")
  );
  const navigate = useNavigate();

  // const [shelterDetails, setShelterDetails] = useState({
  //   shelter_name: "Federal Shelter",
  //   address: {
  //     street: "Idukki",
  //     city: "Idukki",
  //     state: "Kerala",
  //     postal_code: "1234556",
  //     location: {
  //       coordinates: [76.9554446372482, 9.85038951939373],
  //       type: "Point",
  //     },
  //   },
  //   capacity: {
  //     max_capacity: 500,
  //     current_occupancy: 250,
  //     available_beds: 296,
  //   },
  //   medical_cases: { count: 0, details: [] },
  //   supply_status: {
  //     food: 100,
  //     water: 100,
  //     medicine: 100,
  //     other_supplies: 100,
  //   },
  //   sanitation: "good",
  //   last_inspection: "2025-02-28T07:30:19.521Z",
  //   status: "active",
  //   updatedAt: "2025-02-28T12:18:30.734Z",
  // });

  const [shelterDetails, setShelterDetails] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/caretaker/get-caretaker-by-id`, {
        headers: { caretakerId: caretakerId },
      })
      .then((response) => {
        setShelterId(response.data.caretaker.shelter_id);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (shelterId) {
      axios
        .get(`${BASE_URL}/caretaker/shelter`, {
          headers: { shelterId: shelterId },
        })
        .then((response) => {
          setShelterDetails({
            ...response.data.shelter,
            updatedAt: formatDateTime(response.data.shelter.updatedAt),
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [shelterId]);

  useEffect(() => {
    if (shelterDetails) {
      setStats([
        {
          title: "Total Occupants",
          count: `${shelterDetails.capacity.current_occupancy ?? 3}`,
          icon: Users,
          color: "text-blue-500",
          bgColor: "bg-blue-500/20",
        },
        {
          title: "Medical Cases",
          count: `${shelterDetails.medical_cases.count ?? 3}`,
          icon: HeartPulse,
          color: "text-red-500",
          bgColor: "bg-red-500/20",
        },
        {
          title: "Available Beds",
          count: `${shelterDetails.capacity.available_beds ?? 3}`,
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
              4 || 3
          }
                        %`,
          icon: Package,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/20",
        },
      ]);
    }
  }, [shelterDetails]);

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
            <LogOut
              onClick={handleLogout}
              className="w-6 h-6 text-gray-400 hover:text-purple-500 cursor-pointer"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Grid */}
        {shelterDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats &&
              stats.map((stat) => (
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
        )}

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
                <button
                  className="w-full bg-purple-500/10 text-purple-500 py-2 rounded-lg font-semibold hover:bg-purple-500/20 transition-colors"
                  onClick={() => {
                    setViewDailyReportForm(!viewDailyReportForm);
                  }}
                >
                  Submit Daily Report
                </button>
                <button
                  className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-500/20 transition-colors"
                  onClick={() => {
                    setViewShlterUpdateForm(!viewShlterUpdateForm);
                  }}
                >
                  {shelterId ? "Update Shelter Details" : "Create Shelter"}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          {shelterDetails && (
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
                      {shelterDetails.updatedAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Daily Reports */}
              {shelterDetails && (
                <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">Daily Reports</h3>
                  <div className="space-y-4">
                    {shelterDetails.reports &&
                      shelterDetails.reports.map((report) => (
                        <div
                          key={report._id}
                          className="border border-gray-700 rounded-lg p-4 hover:border-purple-500/50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <Clipboard className="w-4 h-4 text-purple-500" />
                                <h4 className="font-semibold">
                                  {report.title}
                                </h4>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                <span>{formatDateTime(report.createdAt)}</span>
                              </div>
                              <p className="text-sm text-gray-300 mt-2">
                                {report.description}
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
              )}
            </div>
          )}
        </div>
      </main>
      {viewShlterUpdateForm === true && (
        <ShelterManagementForm
          onClose={() => setViewShlterUpdateForm(false)}
          shelterId={shelterId}
          caretakerId={caretakerId}
          isUpdate={shelterId ? true : false}
          setShelterDetails={setShelterDetails}
        />
      )}
      {viewDailyReportForm === true && (
        <DailyReportForm
          onClose={() => setViewDailyReportForm(false)}
          shelterId={shelterId}
        />
      )}
    </div>
  );
};

export default CareTakerDashboard;

const DailyReportForm = ({ onClose, shelterId }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios
        .post(`${BASE_URL}/caretaker/shelter/report`, {
          shelterId,
          updates: formData,
        })
        .then((response) => {
          console.log("Report submitted successfully");
        })
        .catch((error) => {
          console.log(error);
        });

      onClose();
    } catch (error) {
      console.error("Error submitting report:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg w-full max-w-2xl mx-4 p-6">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <ClipboardList className="text-purple-500 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-white">Daily Report Form</h1>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Date */}
        <div className="mb-6">
          <div className="text-gray-300">
            Report Date: <span className="text-white">{formatDate()}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic report details */}
          <div className="bg-slate-800/50 p-4 rounded-lg space-y-4">
            <div>
              <label className="block text-gray-200 mb-2">Report Title</label>
              <input
                type="text"
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                placeholder="E.g., Daily Update, Supply Shortage Alert"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2">Description</label>
              <textarea
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white h-32"
                placeholder="Provide details about the current situation at the shelter..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium py-3 px-4 
                     rounded-lg hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 
                     focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0f172a] transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting Report..." : "Submit Daily Report"}
          </button>
        </form>
      </div>
    </div>
  );
};
