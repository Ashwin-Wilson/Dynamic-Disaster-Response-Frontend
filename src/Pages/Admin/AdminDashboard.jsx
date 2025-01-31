import { useState, useEffect } from "react";
import axios from "axios";

//Components
import FamilyTopologySort from "../../Components/FamilyTopologySort";
import FamilyNetworkGraph from "../../Components/FamilyNetworkGraph";

import {
  Shield,
  Settings,
  Bell,
  LogOut,
  AlertTriangle,
  Users,
  Building2,
  Ambulance,
  Car,
  User,
} from "lucide-react";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [familyData, setFamilyData] = useState({
    within5km: { length: 3 },
    within10km: { length: 3 },
    within50km: { length: 3 },
  });

  const [disasterReport, setDisasterReport] = useState({
    location: {
      type: "Point",
      coordinates: [77.209, 28.6139],
    },
    _id: "679b9d62376d9c767da2b160",
    disaster_title: "Earthquake in City A",
    description:
      "A major earthquake with a magnitude of 7.8 hit City A, causing widespread damage to buildings, infrastructure, and loss of life. Many people are trapped under debris, and emergency services are being mobilized.",
    admin_id: "679b344432012bfb4fe31a31",
    intensity: "severe",
    createdAt: "2025-01-30T15:40:18.607Z",
    updatedAt: "2025-01-30T15:40:18.607Z",
    __v: 0,
  });
  const [report, setReport] = useState({
    disaster_report: {
      location: {
        type: "Point",
        coordinates: [77.209, 28.6139],
      },
      _id: "679b9d62376d9c767da2b160",
      disaster_title: "Earthquake in City A",
      description:
        "A major earthquake with a magnitude of 7.8 hit City A, causing widespread damage to buildings, infrastructure, and loss of life. Many people are trapped under debris, and emergency services are being mobilized.",
      admin_id: "679b344432012bfb4fe31a31",
      intensity: "severe",
      createdAt: "2025-01-30T15:40:18.607Z",
      updatedAt: "2025-01-30T15:40:18.607Z",
      __v: 0,
    },
    families: {
      within5km: [
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.1975, 28.604],
            },
            street: "321 Maple St",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679ba079376d9c767da2b16e",
          family_name: "Verma",
          email: "verma@example.com",
          password:
            "$2b$10$KpwKnnTCIIHtl2ssnHl.qOffXkaESd.sePVVCD2.hYbtul/cspOhK",
          role: "Head",
          total_members: 4,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:53:29.448Z",
          createdAt: "2025-01-30T15:53:29.448Z",
          updatedAt: "2025-01-30T15:53:29.448Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.2005, 28.617],
            },
            street: "654 Pine Blvd",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679ba097376d9c767da2b171",
          family_name: "Reddy",
          email: "reddy@example.com",
          password:
            "$2b$10$GEPp039FW7y.C69LxEexbebd6NPQ54mVW7BqMgXiZUmPsTWL2KhHK",
          role: "Head",
          total_members: 5,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:53:59.158Z",
          createdAt: "2025-01-30T15:53:59.159Z",
          updatedAt: "2025-01-30T15:53:59.159Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.2075, 28.611],
            },
            street: "123 Main St",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679b9ebd376d9c767da2b165",
          family_name: "Singh",
          email: "singh@example.com",
          password:
            "$2b$10$EylEeO1HHKOfjBx1VjJUden7BnARpIQxXBKY4/m1NkvRXLaYY.H2.",
          role: "Head",
          total_members: 4,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:46:05.992Z",
          createdAt: "2025-01-30T15:46:05.993Z",
          updatedAt: "2025-01-30T15:46:05.993Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.2105, 28.6125],
            },
            street: "789 Pine Rd",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679b9edd376d9c767da2b16b",
          family_name: "Kumar",
          email: "kumar@example.com",
          password:
            "$2b$10$Vy9ybpv1ee.eMCH6waWJX.L9xenMwWthBD8SGpOE4c0Hbfo.d/CEK",
          role: "Head",
          total_members: 5,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:46:37.163Z",
          createdAt: "2025-01-30T15:46:37.164Z",
          updatedAt: "2025-01-30T15:46:37.164Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.2085, 28.6142],
            },
            street: "456 Oak Ave",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679b9ed0376d9c767da2b168",
          family_name: "Patel",
          email: "patel@example.com",
          password:
            "$2b$10$emMAztp0s8SekADERYj3IOajqr92U0DKiz/SY0IBVAWr8gL.JcRZy",
          role: "Head",
          total_members: 3,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:46:24.766Z",
          createdAt: "2025-01-30T15:46:24.766Z",
          updatedAt: "2025-01-30T15:46:24.766Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.1905, 28.6095],
            },
            street: "987 Oak Dr",
            city: "Lakewood",
            state: "California",
            pincode: "90723",
            proximity_to_risks: [],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679ba0a2376d9c767da2b174",
          family_name: "Sharma",
          email: "sharma@example.com",
          password:
            "$2b$10$sWaZVs9B1cyn56ZyK1.0/.vbAxNZXnH7BujQkL9nWqS2W4CPtNplq",
          role: "Head",
          total_members: 6,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T15:54:10.533Z",
          createdAt: "2025-01-30T15:54:10.534Z",
          updatedAt: "2025-01-30T15:54:10.534Z",
          __v: 0,
        },
      ],
      within10km: [
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.12, 28.6139],
            },
            street: "123 Silver St",
            city: "Lakewood",
            state: "California",
            pincode: "90724",
            proximity_to_risks: [
              {
                risk_type: "river",
                distance: 500,
                details:
                  "Nearby river poses a flood risk during heavy rainfall",
                _id: "679bb6b317d56eb388ca63e3",
              },
            ],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679bb6b317d56eb388ca63e2",
          family_name: "what",
          email: "ash@example.com",
          password:
            "$2b$10$M1aCMb1F3ulyc/a0Cvwn/eJhCgc63QtieVR65.X4rdxATc5CmngHq",
          role: "Head",
          total_members: 4,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T17:28:19.217Z",
          createdAt: "2025-01-30T17:28:19.220Z",
          updatedAt: "2025-01-30T17:28:19.220Z",
          __v: 0,
        },
      ],
      within50km: [
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.5, 28.6139],
            },
            street: "123 Silver St",
            city: "Lakewood",
            state: "California",
            pincode: "90724",
            proximity_to_risks: [
              {
                risk_type: "river",
                distance: 500,
                details:
                  "Nearby river poses a flood risk during heavy rainfall",
                _id: "679baf930e371e1b577e2660",
              },
            ],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679baf930e371e1b577e265f",
          family_name: "Gupta",
          email: "gupta@example.com",
          password:
            "$2b$10$2PU.NgJuTisb.A7aacZQTOlxNPbJWNCQuEfF55Jp0v6jya5yagtDm",
          role: "Head",
          total_members: 4,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T16:57:55.876Z",
          createdAt: "2025-01-30T16:57:55.879Z",
          updatedAt: "2025-01-30T16:57:55.879Z",
          __v: 0,
        },
        {
          address: {
            location: {
              type: "Point",
              coordinates: [77.12, 28.6139],
            },
            street: "123 Silver St",
            city: "Lakewood",
            state: "California",
            pincode: "90724",
            proximity_to_risks: [
              {
                risk_type: "river",
                distance: 500,
                details:
                  "Nearby river poses a flood risk during heavy rainfall",
                _id: "679bb6b317d56eb388ca63e3",
              },
            ],
          },
          housing: {
            type: "permanent",
          },
          medical_requirements: {
            equipment_details: [],
          },
          disaster_preparedness: {
            emergency_contacts: [],
          },
          _id: "679bb6b317d56eb388ca63e2",
          family_name: "what",
          email: "ash@example.com",
          password:
            "$2b$10$M1aCMb1F3ulyc/a0Cvwn/eJhCgc63QtieVR65.X4rdxATc5CmngHq",
          role: "Head",
          total_members: 4,
          family_members: [],
          disaster_history: [],
          last_updated: "2025-01-30T17:28:19.217Z",
          createdAt: "2025-01-30T17:28:19.220Z",
          updatedAt: "2025-01-30T17:28:19.220Z",
          __v: 0,
        },
      ],
    },
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/dashboard`, {
        headers: { disasterId: "679b9d62376d9c767da2b160" },
      })
      .then((response) => {
        setFamilyData(response.data.families);
        setDisasterReport(response.data.disaster_report);
        setReport(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const stats = [
    {
      title: "Report Disaster",
      value: "",
      description: "Report incidents to users",
      icon: AlertTriangle,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      title: "Active Alerts",
      value: "3",
      icon: AlertTriangle,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      title: "Total Evacuee",
      value: "932",
      icon: Users,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Shelters",
      value: "57",
      icon: Building2,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      title: "Volunteers",
      value: "478",
      icon: User,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Ambulances",
      value: "57",
      icon: Ambulance,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      title: "Pickup",
      value: "34",
      icon: Car,
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
    },
  ];

  // data for Pie Chart
  const pieData = {
    labels: ["Within 5km", "Within 10km", "Within 50km"],
    datasets: [
      {
        label: "Statistics",
        data: [
          familyData.within5km.length,
          familyData.within10km.length,
          familyData.within50km.length,
        ],
        backgroundColor: ["#ef4444", "#facc15", "#4caf50"],
        borderWidth: 0,
        spacing: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl text-gray-200">Admin Dashboard</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-gray-200">Admin</p>
              <p className="text-sm text-gray-400">admin@gmail.com</p>
            </div>
          </div>
          <Settings className="w-6 h-6 text-gray-400 cursor-pointer" />
          <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
          <LogOut className="w-6 h-6 text-gray-400 cursor-pointer" />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content Area */}
        <div className="flex-1 bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-xl text-gray-200 text-center mb-4">
            Graphical view
          </h2>
          <div className="aspect-video bg-slate-900 rounded-lg ">
            {/* Placeholder for graphs/charts */}
            <div className="grid grid-cols-2  gap-4">
              {/* Left Side - Pie Chart */}
              <div className="bg-slate-900 rounded-lg flex items-center justify-center p-4 mt-7">
                <Pie data={pieData} />
              </div>
              {/* Right Side - Placeholder */}
              <div className="bg-slate-900 rounded-lg flex items-center justify-center p-4">
                {/* <FamilyTopologySort disasterData={report} /> */}
                <FamilyNetworkGraph disasterData={report} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="w-64 space-y-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-4 flex items-center space-x-4"
            >
              <div className={`p-3 rounded-full ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <h3 className="text-gray-200">{stat.title}</h3>
                {stat.description ? (
                  <p className="text-sm text-gray-400">{stat.description}</p>
                ) : (
                  <p className="text-xl font-semibold text-gray-200">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
