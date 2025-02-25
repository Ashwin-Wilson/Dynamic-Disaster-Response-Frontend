import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const FamilyListView = () => {
  const [families, setFamilies] = useState([]);
  const [sortedFamilies, setSortedFamilies] = useState([]);
  const [disasterLoc, setDisasterLoc] = useState(null);
  const [familyData, setFamilyData] = useState(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admin/get-all-families`);
        setFamilyData(response.data.families);
      } catch (error) {
        console.error("Error fetching families:", error);
      }

      try {
        axios
          .get(`${BASE_URL}/admin/get-all-disaster-reports`)
          .then((response) => {
            if (
              response.data.disasterReports &&
              response.data.disasterReports.length > 0
            ) {
              // Use the most recent disaster report
              setDisasterLoc(
                response.data.disasterReports[0].location.coordinates
              );
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
    };

    fetchFamilies();
  }, []);

  useEffect(() => {
    if (familyData && disasterLoc) {
      if (Array.isArray(familyData)) {
        const sorted = sortFamiliesByNewPriorities(familyData, disasterLoc);
        setSortedFamilies(sorted);
        setFamilies(familyData);
      } else {
        console.error("Data is not an array:", familyData);
      }
    }
  }, [disasterLoc, familyData]);

  // Calculate distance between two coordinates in meters
  const calculateDistance = (coord1, coord2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (coord1[1] * Math.PI) / 180; // lat1 in radians
    const φ2 = (coord2[1] * Math.PI) / 180; // lat2 in radians
    const Δφ = ((coord2[1] - coord1[1]) * Math.PI) / 180; // lat difference in radians
    const Δλ = ((coord2[0] - coord1[0]) * Math.PI) / 180; // lng difference in radians

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate disaster proximity score - closer = higher score
  const calculateDisasterProximityScore = (family, disasterLocation) => {
    const familyCoords = family.address.location.coordinates;
    const distance = calculateDistance(familyCoords, disasterLocation);

    // Normalize distance into a score (closer = higher score)
    // Max score of 100 for families at the disaster location
    // Score decreases as distance increases
    const proximityScore = Math.max(0, 100 - (distance / 1000) * 10); // 10 points per km away

    return {
      proximityScore,
      distance,
    };
  };

  // Calculate family's vulnerability score
  const calculateVulnerabilityScore = (family) => {
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

  // Calculate proximity score to vulnerable families
  const calculateProximityToVulnerableFamilies = (family, allFamilies) => {
    // Find vulnerable families (excluding the current family)
    const vulnerableFamilies = allFamilies.filter(
      (f) =>
        f._id !== family._id &&
        (f.family_members.some((m) => m.is_vulnerable) ||
          f.medical_requirements.dependent_on_equipment ||
          f.medical_requirements.immediate_medical_assistance_needed)
    );

    if (vulnerableFamilies.length === 0) {
      return 0; // No vulnerable families to be close to
    }

    // Calculate distances to all vulnerable families
    const distances = vulnerableFamilies.map((vulnFamily) => {
      return calculateDistance(
        family.address.location.coordinates,
        vulnFamily.address.location.coordinates
      );
    });

    // Get the closest vulnerable family distance
    const minDistance = Math.min(...distances);

    // Convert to proximity score (closer = higher score)
    // Max score of 100 for being at the same location
    // Score decreases as distance increases
    const proximityScore = Math.max(0, 100 - (minDistance / 1000) * 20); // 20 points per km away

    return proximityScore;
  };

  const sortFamiliesByNewPriorities = (familiesData, disasterLocation) => {
    // Step 1: Calculate all scores
    const familiesWithScores = familiesData.map((family) => {
      // 1. Proximity to disaster
      const { proximityScore: disasterProximityScore, distance } =
        calculateDisasterProximityScore(family, disasterLocation);

      // 2. Vulnerability score
      const vulnerabilityScore = calculateVulnerabilityScore(family);

      return {
        ...family,
        disasterProximityScore,
        vulnerabilityScore,
        distance,
      };
    });

    // Step 2: Calculate proximity to vulnerable families
    const familiesWithAllScores = familiesWithScores.map((family) => {
      const proximityToVulnerableScore = calculateProximityToVulnerableFamilies(
        family,
        familiesWithScores
      );

      // Calculate final priority score with weights:
      // - 50% for disaster proximity (highest priority)
      // - 30% for vulnerability score
      // - 20% for proximity to vulnerable families
      const finalPriorityScore =
        family.disasterProximityScore * 0.5 +
        family.vulnerabilityScore * 0.3 +
        proximityToVulnerableScore * 0.2;

      return {
        ...family,
        proximityToVulnerableScore,
        finalPriorityScore,
      };
    });

    // Step 3: Sort by priority score (descending)
    return familiesWithAllScores.sort(
      (a, b) => b.finalPriorityScore - a.finalPriorityScore
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-4xl font-bold text-white mb-6">
        Families List (Evacuation Priority)
      </h2>
      <div className="grid gap-4">
        {sortedFamilies.map((family, index) => (
          <div
            key={family._id}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 relative"
          >
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
                <h3 className="font-semibold text-gray-400">
                  Distance to Disaster
                </h3>
                <p className="text-white">
                  {disasterLoc && family.address.location.coordinates
                    ? `${(
                        calculateDistance(
                          family.address.location.coordinates,
                          disasterLoc
                        ) / 1000
                      ).toFixed(2)} km`
                    : "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-400">
                  Vulnerability Score
                </h3>
                <p className="font-bold text-red-500">
                  {family.vulnerabilityScore}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-400">
                  Vulnerable Members
                </h3>
                <p className="text-white">
                  {family.family_members.filter((m) => m.is_vulnerable).length}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-400">
                  Disaster Proximity Score
                </h3>
                <p className="text-orange-500 font-semibold">
                  {family.disasterProximityScore.toFixed(1)}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-400">
                  Proximity to Vulnerable
                </h3>
                <p className="text-blue-500 font-semibold">
                  {family.proximityToVulnerableScore?.toFixed(1) || "0.0"}
                </p>
              </div>
            </div>

            <div className="mt-2 flex items-center">
              {family.medical_requirements.dependent_on_equipment && (
                <div className="text-red-500 font-semibold mr-4">
                  Requires Medical Equipment
                </div>
              )}

              {family.medical_requirements
                .immediate_medical_assistance_needed && (
                <div className="text-red-500 font-semibold">
                  Needs Immediate Medical Assistance
                </div>
              )}
            </div>

            {/* Priority ranking */}
            <div className="absolute bottom-4 right-2  bg-blue-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
              {index + 1}
            </div>

            {/* Final priority score */}
            <div className="absolute bottom-4 right-12  bg-green-600 text-white font-bold rounded-md px-2 py-1 text-sm">
              Score: {family.finalPriorityScore?.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyListView;
