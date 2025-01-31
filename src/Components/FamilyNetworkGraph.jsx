import React, { useEffect, useState } from "react";
import { Camera } from "lucide-react";

const FamilyNetworkGraph = ({ disasterData }) => {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  // Canvas setup constants
  const CANVAS_WIDTH = 500;
  const CANVAS_HEIGHT = 650;
  const NODE_RADIUS = 20;

  // Node color mapping based on distance from disaster
  const getNodeColor = (distance) => {
    if (distance <= 5) return "#ff4444"; // Red for closest
    if (distance <= 10) return "#facc15"; // Orange for medium
    if (distance <= 50) return "#4caf50"; // Yellow for far
    return "#4caf50"; // Green for farthest
  };

  useEffect(() => {
    if (disasterData) {
      const allFamilies = [
        ...disasterData.families.within5km,
        ...disasterData.families.within10km,
        ...disasterData.families.within50km,
      ];

      // Create nodes
      const nodes = allFamilies.map((family, index) => {
        const angle = (2 * Math.PI * index) / allFamilies.length;
        const radius = 200; // Distance from center

        return {
          id: family._id,
          name: family.family_name,
          x: CANVAS_WIDTH / 2 + radius * Math.cos(angle),
          y: CANVAS_HEIGHT / 2 + radius * Math.sin(angle),
          distance: calculateDistance(
            family.address.location.coordinates,
            disasterData.disaster_report.location.coordinates
          ),
        };
      });

      // Create edges (connections between nodes)
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = calculateDistance(
            allFamilies[i].address.location.coordinates,
            allFamilies[j].address.location.coordinates
          );
          // Only connect nodes if they're within 2km of each other
          if (distance <= 2) {
            edges.push({
              source: nodes[i].id,
              target: nodes[j].id,
              distance: distance,
            });
          }
        }
      }

      setGraphData({ nodes, edges });
    }
  }, [disasterData]);

  // Calculate distance between coordinates
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

  // Draw the graph using SVG
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <svg width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="bg-slate-900">
        {/* Draw edges first so they appear behind nodes */}
        {graphData.edges.map((edge, index) => {
          const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
          const targetNode = graphData.nodes.find((n) => n.id === edge.target);
          return (
            <line
              key={`edge-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="white"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}

        {/* Draw nodes */}
        {graphData.nodes.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r={NODE_RADIUS}
              fill={getNodeColor(node.distance)}
              className="cursor-pointer"
            />
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dy=".3em"
              fill="white"
              fontSize="12"
              className="pointer-events-none"
            >
              {node.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/10 p-4 rounded-lg">
        <div className="text-white text-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span>{"< 5km"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <span>{"5-10km"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span>{"10-50km"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyNetworkGraph;
