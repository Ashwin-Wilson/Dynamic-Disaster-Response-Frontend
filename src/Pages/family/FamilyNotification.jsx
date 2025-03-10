import { useState, useEffect } from "react";
import axios from "axios";

import { AlertTriangle } from "lucide-react";

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

const FamilyNotification = () => {
  const [disaterReport, setDisasterReport] = useState(null);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/get-all-disaster-reports`)
      .then((response) => {
        setDisasterReport(response.data.disasterReports);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  return (
    <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg h-screen">
      <div className="border-gray-900 ">
        <h3 className="text-lg font-semibold mb-4 ">Active Alerts</h3>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {disaterReport &&
          disaterReport.map((item) => (
            <div
              key={item._id}
              className="border border-gray-700 rounded-lg p-4 hover:border-red-500/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <h4 className="font-semibold text-red-500">
                      {item.disaster_title}
                    </h4>
                  </div>

                  <p className="text-sm text-gray-300 mt-2">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDateTime(item.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FamilyNotification;
