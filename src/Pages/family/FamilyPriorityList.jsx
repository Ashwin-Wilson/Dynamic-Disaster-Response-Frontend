import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const FamilyPriorityList = () => {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Calculate priority score for topological sorting
  const calculatePriorityScore = (family) => {
    let score = 0;

    // Medical conditions then.. highest priority
    if (family.requiresMedicalEquipment) score += 100;
    if (family.medicalConditions && family.medicalConditions.trim() !== "")
      score += 80;

    // Elderly and children add to priority
    score += (family.elderly || 0) * 40;
    score += (family.children || 0) * 30;

    // Transportation needs
    if (family.needsTransportation) score += 20;

    // Family size factor
    score += (family.totalMembers || 0) * 10;

    return score;
  };

  // Topological sort implementation
  const topologicalSort = (familyData) => {
    // Create adjacency list based on dependencies
    const graph = {};
    const visited = new Set();
    const sorted = [];

    // Initialize graph
    familyData.forEach((family) => {
      graph[family._id] = {
        data: family,
        dependencies: [],
      };
    });

    // Add dependencies based on priority scores
    familyData.forEach((family1) => {
      familyData.forEach((family2) => {
        if (family1._id !== family2._id) {
          const score1 = calculatePriorityScore(family1);
          const score2 = calculatePriorityScore(family2);
          if (score1 > score2) {
            graph[family2._id].dependencies.push(family1._id);
          }
        }
      });
    });

    // DFS function for topological sort
    const dfs = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      graph[nodeId].dependencies.forEach((dependencyId) => {
        dfs(dependencyId);
      });

      sorted.unshift(graph[nodeId].data);
    };

    // Perform DFS for each node
    Object.keys(graph).forEach((nodeId) => {
      if (!visited.has(nodeId)) {
        dfs(nodeId);
      }
    });

    return sorted;
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/family/all",
          {
            headers: {
              token: token,
            },
          }
        );

        const sortedFamilies = topologicalSort(response.data);
        setFamilies(sortedFamilies);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching family data");
        setLoading(false);
      }
    };

    fetchFamilies();
  }, []);

  // Priority level badge component
  const PriorityBadge = ({ score }) => {
    let color = "bg-green-500";
    let text = "Low";

    if (score >= 200) {
      color = "bg-red-500";
      text = "Critical";
    } else if (score >= 100) {
      color = "bg-orange-500";
      text = "High";
    } else if (score >= 50) {
      color = "bg-yellow-500";
      text = "Medium";
    }

    return (
      <span className={`${color} text-white text-sm px-2 py-1 rounded-full`}>
        {text}
      </span>
    );
  };
  PriorityBadge.propTypes = {
    score: PropTypes.number.isRequired,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded p-4 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-white">
        Priority Family List
      </h2>
      <div className="space-y-4">
        {families.map((family) => {
          const priorityScore = calculatePriorityScore(family);
          return (
            <div
              key={family._id}
              className="bg-slate-800 rounded-lg p-4 shadow-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {family.name}
                  </h3>
                  <p className="text-gray-400">
                    Contact: {family.contactNumber}
                  </p>
                </div>
                <PriorityBadge score={priorityScore} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="text-gray-300 font-medium mb-2">
                    Family Composition
                  </h4>
                  <ul className="text-gray-400 space-y-1">
                    <li>Total Members: {family.totalMembers}</li>
                    <li>Children: {family.children}</li>
                    <li>Elderly: {family.elderly}</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-gray-300 font-medium mb-2">
                    Medical & Transport
                  </h4>
                  <ul className="text-gray-400 space-y-1">
                    {family.medicalConditions && (
                      <li>Medical Conditions: {family.medicalConditions}</li>
                    )}
                    {family.requiresMedicalEquipment && (
                      <li>Requires Medical Equipment</li>
                    )}
                    {family.needsTransportation && (
                      <li>Needs Transportation</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FamilyPriorityList;
