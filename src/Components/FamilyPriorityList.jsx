import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FamilyListView = () => {
  const [families, setFamilies] = useState([]);
  const [sortedFamilies, setSortedFamilies] = useState([]);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/get-all-families`);
        const data = response.data.families || response.data; // Adjust based on API response structure
        console.log("API Response:", data);

        if (Array.isArray(data)) {
          const sorted = sortFamiliesByRisk(data);
          setSortedFamilies(sorted);
          setFamilies(data);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching families:", error);
      }
    };

    fetchFamilies();
  }, []);

  const sortFamiliesByRisk = (familiesData) => {
    return familiesData.sort((a, b) => {
      // Calculate risk scores
      const scoreA = calculateRiskScore(a);
      const scoreB = calculateRiskScore(b);
      return scoreB - scoreA; // Sort descending
    });
  };

  const calculateRiskScore = (family) => {
    let score = 0;

    // Vulnerable members
    const vulnerableCount = family.family_members.filter(
      (m) => m.is_vulnerable
    ).length;
    score += vulnerableCount * 10;

    // Medical requirements
    if (family.medical_requirements.dependent_on_equipment) score += 15;
    if (family.medical_requirements.immediate_medical_assistance_needed)
      score += 20;

    // Proximity to risks
    family.address.proximity_to_risks.forEach((risk) => {
      if (risk.distance < 100) score += 25;
      else if (risk.distance < 500) score += 15;
      else if (risk.distance < 1000) score += 5;
    });

    // Housing type
    if (family.housing.type === "makeshift") score += 20;
    if (family.housing.type === "temporary") score += 10;

    return score;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-4xl font-bold text-white mb-6">
        Families List (Priority Order)
      </h2>
      <div className="grid gap-4">
        {sortedFamilies.map((family) => (
          <div
            key={family._id}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-gray-400">Family Name</h3>
                <p className="text-white">{family.family_name}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Total Members</h3>
                <p className="text-white">{family.total_members}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Location</h3>
                <p className="text-white">
                  {family.address.city}, {family.address.state}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">Risk Score</h3>
                <p className="font-bold text-red-500">
                  {calculateRiskScore(family)}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-400">
                Vulnerable Members
              </h3>
              <p className="text-white">
                {family.family_members.filter((m) => m.is_vulnerable).length}
              </p>
            </div>

            {family.medical_requirements.dependent_on_equipment && (
              <div className="mt-2 text-red-500 font-semibold">
                Requires Medical Equipment
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyListView;
