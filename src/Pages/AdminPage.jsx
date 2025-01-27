import React from "react";
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

const AdminPage = () => {
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
          <div className="aspect-video bg-slate-800/80 rounded-lg">
            {/* Placeholder for graphs/charts */}
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

export default AdminPage;
