import React from "react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Dynamic Disaster Response
        </h1>
        <p className="text-gray-300 mb-8">
          select your role to access the system
        </p>

        <div className="grid grid-cols-2 gap-15">
          {/* User Login */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg  border border-gray-600">
            <div className="flex flex-col items-start">
              <div className="text-blue-500 text-4xl mb-2">
                <img
                  src="src/assets/Icons/user_icon.png"
                  className="w-10 h-10"
                />
              </div>
              <h2 className="text-white text-xl font-semibold">User login</h2>
              <p className="text-gray-400">Login and get help</p>
            </div>
          </div>

          {/* Admin Login */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg  border border-gray-600">
            <div className="flex flex-col items-start">
              <div className="text-red-500 text-4xl mb-2">
                <img
                  src="src/assets/Icons/admin_icon.png"
                  className="w-10 h-10"
                />
              </div>
              <h2 className="text-white text-xl font-semibold">Admin login</h2>
              <p className="text-gray-400">System administrator</p>
            </div>
          </div>

          {/* Volunteer */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg  border border-gray-600">
            <div className="flex flex-col items-start">
              <div className="text-green-500 text-4xl mb-2">
                <img
                  src="src/assets/Icons/volunteer_icon.png"
                  className="w-10 h-10"
                />
              </div>
              <h2 className="text-white text-xl font-semibold">Volunteer</h2>
              <p className="text-gray-400">Help</p>
            </div>
          </div>

          {/* Driver */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg  border border-gray-600">
            <div className="flex flex-col items-start">
              <div className="text-yellow-500 text-4xl mb-2">
                <img
                  src="src/assets/Icons/driver_icon.png"
                  className="w-10 h-10"
                />
              </div>
              <h2 className="text-white text-xl font-semibold">Driver</h2>
              <p className="text-gray-400">Login and get help</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
