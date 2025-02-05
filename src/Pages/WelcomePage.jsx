import { User, Shield, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-4">
          Dynamic Disaster Response
        </h1>
        <p className="text-xl text-gray-400">
          select your role to access the system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* User Login Card */}
        <div
          onClick={() => navigate("/family/signup")}
          className="bg-slate-800/50 rounded-lg p-6 cursor-pointer
                    hover:bg-slate-800/70 transition-all duration-300
                    border border-slate-700 hover:border-slate-600"
        >
          <div className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-blue-500 mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white mb-2">User login</h2>
              <p className="text-gray-400">Login and get help</p>
            </div>
          </div>
        </div>

        {/* Admin Login Card */}
        <div
          onClick={() => {
            console.log("Admin login clicked");
            navigate("/Admin/login");
          }}
          className="bg-slate-800/50 rounded-lg p-6 cursor-pointer
                    hover:bg-slate-800/70 transition-all duration-300
                    border border-slate-700 hover:border-slate-600"
        >
          <div className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-red-500 mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white mb-2">Admin login</h2>
              <p className="text-gray-400">System administrator</p>
            </div>
          </div>
        </div>

        {/* Volunteer Card */}
        <div
          onClick={() => navigate("/volunteer-dashboard")}
          className="bg-slate-800/50 rounded-lg p-6 cursor-pointer
                    hover:bg-slate-800/70 transition-all duration-300
                    border border-slate-700 hover:border-slate-600"
        >
          <div className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-green-500 mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white mb-2">Volunteer</h2>
              <p className="text-gray-400">Help others</p>
            </div>
          </div>
        </div>

        {/* Driver Card */}
        <div
          onClick={() => navigate("/driver-dashboard")}
          className="bg-slate-800/50 rounded-lg p-6 cursor-pointer
                    hover:bg-slate-800/70 transition-all duration-300
                    border border-slate-700 hover:border-slate-600"
        >
          <div className="flex flex-col items-start">
            <div className="p-3 rounded-full bg-yellow-500 mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl text-white mb-2">Driver</h2>
              <p className="text-gray-400">Driver login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
