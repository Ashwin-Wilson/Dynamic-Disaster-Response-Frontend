import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const FamilyTopologySort = ({ disasterData }) => {
  console.log(disasterData);
  const [sortedFamilies, setSortedFamilies] = useState([]);
  const [graphData, setGraphData] = useState([]);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (coords1, coords2) => {
    const [lon1, lat1] = coords1;
    const [lon2, lat2] = coords2;
    const R = 6371; // Earth's radius in km

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Create adjacency list representation of the graph
  const createGraph = (families, disasterLocation) => {
    const graph = new Map();
    const distances = new Map();

    // Initialize graph with all families
    families.forEach((family) => {
      graph.set(family._id, []);
      distances.set(
        family._id,
        calculateDistance(
          family.address.location.coordinates,
          disasterLocation.coordinates
        )
      );
    });

    // Create edges based on distance and dependencies
    families.forEach((family1) => {
      families.forEach((family2) => {
        if (family1._id !== family2._id) {
          const distance = calculateDistance(
            family1.address.location.coordinates,
            family2.address.location.coordinates
          );

          // Create an edge if families are within 2km of each other
          if (distance <= 2) {
            // The family closer to the disaster point becomes dependent on the farther one
            if (distances.get(family1._id) < distances.get(family2._id)) {
              graph.get(family2._id).push({
                id: family1._id,
                distance: distance,
              });
            } else {
              graph.get(family1._id).push({
                id: family2._id,
                distance: distance,
              });
            }
          }
        }
      });
    });

    return graph;
  };

  // Perform topological sort using DFS
  const topologicalSort = (graph) => {
    const visited = new Set();
    const sorted = [];
    const tempMark = new Set();

    const visit = (nodeId) => {
      if (tempMark.has(nodeId)) {
        return; // Skip if already temporarily marked (handle cycles)
      }
      if (!visited.has(nodeId)) {
        tempMark.add(nodeId);
        const neighbors = graph.get(nodeId) || [];
        neighbors.forEach((neighbor) => {
          visit(neighbor.id);
        });
        tempMark.delete(nodeId);
        visited.add(nodeId);
        sorted.unshift(nodeId);
      }
    };

    for (let nodeId of graph.keys()) {
      if (!visited.has(nodeId)) {
        visit(nodeId);
      }
    }

    return sorted;
  };

  useEffect(() => {
    if (disasterData) {
      const allFamilies = [
        ...disasterData.families.within5km,
        ...disasterData.families.within10km,
        ...disasterData.families.within50km,
      ];

      // Create graph
      const graph = createGraph(
        allFamilies,
        disasterData.disaster_report.location
      );

      // Perform topological sort
      const sorted = topologicalSort(graph);

      // Map sorted IDs back to family objects
      const sortedFamilyObjects = sorted
        .map((id) => allFamilies.find((family) => family._id === id))
        .filter(Boolean);

      setSortedFamilies(sortedFamilyObjects);

      // Create visualization data
      const visualData = sortedFamilyObjects.map((family, index) => ({
        name: family.family_name,
        distance: calculateDistance(
          family.address.location.coordinates,
          disasterData.disaster_report.location.coordinates
        ),
      }));

      setGraphData(visualData);
    }
  }, [disasterData]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Family Evacuation Priority Order
      </h2>

      {/* Visualization */}
      <div className="mb-6">
        <LineChart width={600} height={300} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{
              value: "Distance from Disaster (km)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="distance" stroke="#8884d8" />
        </LineChart>
      </div>

      {/* Sorted List */}
      <div className="space-y-2">
        {sortedFamilies.map((family, index) => (
          <div key={family._id} className="p-2 bg-gray-100 rounded">
            <span className="font-bold">
              {index + 1}. {family.family_name}
            </span>
            <span className="ml-4 text-gray-600">
              Total Members: {family.total_members}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyTopologySort;
