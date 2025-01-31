import { User, Shield, Phone, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();
  const roles = [
    {
      title: "User login",
      onClick: () => {
        window.location.href = "/family-dashboard";
      },
      description: "Login and get help",
      icon: User,
      iconBg: "bg-blue-500",
      iconColor: "text-white",
    },
    {
      title: "Admin login",

      onClick: () =>
        // Navigate to specific path
        {
          console.log("Admin login clicked");
          navigate("/admin-dashboard");
        },
      description: "System administrator",
      icon: Shield,
      iconBg: "bg-red-500",
      iconColor: "text-white",
    },
    {
      title: "Volunteer",
      description: "Help",
      icon: Phone,
      iconBg: "bg-green-500",
      iconColor: "text-white",
    },
    {
      title: "Driver",
      description: "Login and get help",
      icon: Truck,
      iconBg: "bg-yellow-500",
      iconColor: "text-white",
    },
  ];

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
        {roles.map((role, index) => (
          <div
            key={index}
            className="bg-slate-800/50 rounded-lg p-6 cursor-pointer 
                     hover:bg-slate-800/70 transition-all duration-300
                     border border-slate-700 hover:border-slate-600"
          >
            <div className="flex flex-col items-start">
              <div className={`p-3 rounded-full ${role.iconBg} mb-4`}>
                <role.icon className={`w-6 h-6 ${role.iconColor}`} />
              </div>
              <div>
                <h2 className="text-xl text-white mb-2">{role.title}</h2>
                <p className="text-gray-400">{role.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
