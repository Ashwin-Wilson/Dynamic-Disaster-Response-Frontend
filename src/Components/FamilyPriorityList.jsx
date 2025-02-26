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
        // Use topological sorting instead of priority-based sorting
        const sorted = buildDependencyGraphAndSort(familyData, disasterLoc);
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

  // Determine if a family is vulnerable
  const isVulnerableFamily = (family) => {
    return (
      family.family_members.some((m) => m.is_vulnerable) ||
      family.medical_requirements.dependent_on_equipment ||
      family.medical_requirements.immediate_medical_assistance_needed
    );
  };

  // Calculate family's vulnerability score (kept for display purposes)
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

  // Calculate disaster proximity score (kept for display purposes)
  const calculateDisasterProximityScore = (family, disasterLocation) => {
    const familyCoords = family.address.location.coordinates;
    const distance = calculateDistance(familyCoords, disasterLocation);
    const proximityScore = Math.max(0, 100 - (distance / 1000) * 10); // 10 points per km away

    return {
      proximityScore,
      distance,
    };
  };

  // Build dependency graph and perform topological sorting
  const buildDependencyGraphAndSort = (familiesData, disasterLocation) => {
    // Step 1: Classify families as vulnerable or non-vulnerable
    const vulnerableFamilies = [];
    const nonVulnerableFamilies = [];

    familiesData.forEach((family) => {
      if (isVulnerableFamily(family)) {
        vulnerableFamilies.push(family);
      } else {
        nonVulnerableFamilies.push(family);
      }
    });

    // Step 2: Calculate disaster proximity for all families (for prioritization)
    const familiesWithProximity = familiesData.map((family) => {
      const { proximityScore, distance } = calculateDisasterProximityScore(
        family,
        disasterLocation
      );
      const vulnerabilityScore = calculateVulnerabilityScore(family);

      return {
        ...family,
        disasterProximityScore: proximityScore,
        vulnerabilityScore,
        distance,
      };
    });

    // Step 3: Build adjacency list representing dependencies
    // Each vulnerable family depends on its nearest non-vulnerable family
    const graph = {};
    const inDegree = {};

    // Initialize graph for all families
    familiesData.forEach((family) => {
      graph[family._id] = [];
      inDegree[family._id] = 0;
    });

    // For each vulnerable family, find the nearest non-vulnerable family
    // and create a dependency (edge)
    vulnerableFamilies.forEach((vulnFamily) => {
      if (nonVulnerableFamilies.length === 0) return;

      let nearestNonVuln = null;
      let minDistance = Infinity;

      nonVulnerableFamilies.forEach((nonVulnFamily) => {
        const distance = calculateDistance(
          vulnFamily.address.location.coordinates,
          nonVulnFamily.address.location.coordinates
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestNonVuln = nonVulnFamily;
        }
      });

      if (nearestNonVuln) {
        // Create dependency: vulnerable family depends on non-vulnerable family
        // So non-vulnerable family must be evacuated first
        graph[nearestNonVuln._id].push(vulnFamily._id);
        inDegree[vulnFamily._id]++;
      }
    });

    // Step 4: Apply Kahn's algorithm for topological sorting
    const topologicalOrder = [];
    const queue = [];

    // Start with nodes that have no dependencies (inDegree = 0)
    Object.keys(inDegree).forEach((familyId) => {
      if (inDegree[familyId] === 0) {
        queue.push(familyId);
      }
    });

    // Sort queue by disaster proximity (families closer to disaster get priority)
    queue.sort((a, b) => {
      const familyA = familiesWithProximity.find((f) => f._id === a);
      const familyB = familiesWithProximity.find((f) => f._id === b);
      return familyB.disasterProximityScore - familyA.disasterProximityScore;
    });

    // Process the queue
    while (queue.length > 0) {
      // Take the family with highest priority (closest to disaster)
      const current = queue.shift();
      topologicalOrder.push(current);

      // For each dependent family
      graph[current].forEach((dependentFamilyId) => {
        inDegree[dependentFamilyId]--;

        // If all dependencies are satisfied, add to queue
        if (inDegree[dependentFamilyId] === 0) {
          queue.push(dependentFamilyId);
        }
      });

      // Re-sort the queue each time to ensure disaster proximity priority
      queue.sort((a, b) => {
        const familyA = familiesWithProximity.find((f) => f._id === a);
        const familyB = familiesWithProximity.find((f) => f._id === b);
        return familyB.disasterProximityScore - familyA.disasterProximityScore;
      });
    }

    // Check for cycles in the graph
    if (topologicalOrder.length !== Object.keys(graph).length) {
      console.error("Graph has cycles! Topological sort not possible.");
      // Fall back to proximity-based sorting if topological sort fails
      return familiesWithProximity.sort(
        (a, b) => b.disasterProximityScore - a.disasterProximityScore
      );
    }

    // Map the order back to the full family objects with scores for display
    return topologicalOrder.map((familyId) => {
      const family = familiesWithProximity.find((f) => f._id === familyId);

      // Add dependency information
      const dependencies = graph[familyId].map((depId) => {
        const depFamily = familiesData.find((f) => f._id === depId);
        return depFamily.family_name;
      });

      // Add who this family depends on
      const dependsOn = Object.entries(graph)
        .filter(([_, deps]) => deps.includes(familyId))
        .map(([parentId, _]) => {
          const parentFamily = familiesData.find((f) => f._id === parentId);
          return parentFamily.family_name;
        });

      return {
        ...family,
        dependencies,
        dependsOn: dependsOn.length > 0 ? dependsOn[0] : null,
        // Calculate a display score that combines topological order with proximity
        finalPriorityScore: family.disasterProximityScore,
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-4xl font-bold text-white mb-6">
        Families List (Evacuation Priority - Topological Order)
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
                  Dependency Status
                </h3>
                <p className="text-blue-500 font-semibold">
                  {isVulnerableFamily(family)
                    ? `Depends on: ${family.dependsOn || "None"}`
                    : `Supporting: ${
                        family.dependencies?.length || 0
                      } families`}
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
            <div className="absolute bottom-4 right-2 bg-blue-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
              {index + 1}
            </div>

            {/* Family type indicator */}
            <div
              className={`absolute bottom-4 right-12 ${
                isVulnerableFamily(family) ? "bg-red-600" : "bg-green-600"
              } text-white font-bold rounded-md px-2 py-1 text-sm`}
            >
              {isVulnerableFamily(family) ? "Vulnerable" : "Support"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyListView;
