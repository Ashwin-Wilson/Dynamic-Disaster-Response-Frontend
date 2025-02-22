import { useEffect, useRef, useState } from "react";

const FamilyNetworkGraph = ({ disasterReport, families }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!disasterReport || !families) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    const drawGraph = () => {
      // Clear canvas
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save the current transformation matrix
      ctx.save();

      // Apply zoom and pan transformations
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      // Calculate bounds
      const coordinates = [
        disasterReport.location.coordinates,
        ...families.within5km.map((f) => f.address.location.coordinates),
        ...families.within10km.map((f) => f.address.location.coordinates),
        ...families.within50km.map((f) => f.address.location.coordinates),
      ];

      const bounds = coordinates.reduce(
        (acc, coord) => ({
          minLng: Math.min(acc.minLng, coord[0]),
          maxLng: Math.max(acc.maxLng, coord[0]),
          minLat: Math.min(acc.minLat, coord[1]),
          maxLat: Math.max(acc.maxLat, coord[1]),
        }),
        {
          minLng: Infinity,
          maxLng: -Infinity,
          minLat: Infinity,
          maxLat: -Infinity,
        }
      );

      // Scale factor to fit coordinates in canvas
      const padding = 50;
      const scaleX =
        (canvas.width - padding * 2) / (bounds.maxLng - bounds.minLng);
      const scaleY =
        (canvas.height - padding * 2) / (bounds.maxLat - bounds.minLat);

      const toCanvasCoords = (lng, lat) => ({
        x: (lng - bounds.minLng) * scaleX + padding,
        y: canvas.height - ((lat - bounds.minLat) * scaleY + padding),
      });

      const calculateDistance = (coord1, coord2) => {
        const R = 6371e3;
        const φ1 = (coord1[1] * Math.PI) / 180;
        const φ2 = (coord2[1] * Math.PI) / 180;
        const Δφ = ((coord2[1] - coord1[1]) * Math.PI) / 180;
        const Δλ = ((coord2[0] - coord1[0]) * Math.PI) / 180;

        const a =
          Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
      };

      const drawEdge = (startCoord, endCoord, distance) => {
        const start = toCanvasCoords(startCoord[0], startCoord[1]);
        const end = toCanvasCoords(endCoord[0], endCoord[1]);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = "#64748b";
        ctx.lineWidth = 1;
        ctx.stroke();

        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px sans-serif";
        ctx.fillText(`${Math.round(distance)}m`, midX, midY);
      };

      const drawNode = (coord, color, label) => {
        const pos = toCanvasCoords(coord[0], coord[1]);

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px sans-serif";
        ctx.fillText(label, pos.x + 10, pos.y);
      };

      // Draw disaster node
      const disasterCoord = disasterReport.location.coordinates;
      drawNode(disasterCoord, "#ef4444", "Disaster");

      // Draw family nodes and edges
      const drawFamilyNodes = (familyList, color) => {
        familyList.forEach((family) => {
          const familyCoord = family.address.location.coordinates;
          const distance = calculateDistance(disasterCoord, familyCoord);

          drawEdge(disasterCoord, familyCoord, distance);
          drawNode(familyCoord, color, family.family_name);
        });
      };

      drawFamilyNodes(families.within5km, "#f97316");
      drawFamilyNodes(families.within10km, "#facc15");
      drawFamilyNodes(families.within50km, "#22c55e");

      // Restore the transformation matrix
      ctx.restore();
    };

    // Add event listeners for zoom and pan
    const handleWheel = (e) => {
      e.preventDefault();
      const delta = -Math.sign(e.deltaY);
      const factor = 0.1;
      const newScale = scale + delta * factor;

      if (newScale >= 0.5 && newScale <= 10) {
        // Get mouse position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate new offset to zoom toward mouse position
        const newOffset = {
          x: offset.x - (x - offset.x) * (delta * factor),
          y: offset.y - (y - offset.y) * (delta * factor),
        };

        setScale(newScale);
        setOffset(newOffset);
      }
    };

    const handleMouseDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - rect.left - offset.x,
        y: e.clientY - rect.top - offset.y,
      });
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const rect = canvas.getBoundingClientRect();
        setOffset({
          x: e.clientX - rect.left - dragStart.x,
          y: e.clientY - rect.top - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    // Initial draw
    drawGraph();

    // Redraw when scale or offset changes
    const animationFrame = requestAnimationFrame(drawGraph);

    return () => {
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      cancelAnimationFrame(animationFrame);
    };
  }, [disasterReport, families, scale, offset, isDragging, dragStart]);

  return (
    <div className="p-4 h-32 bg-slate-900 rounded-lg">
      <div className="mt-2 text-slate-400 text-sm">
        Scroll to zoom, drag to pan
      </div>
      <canvas
        ref={canvasRef}
        className="w-full  h-120 rounded-lg cursor-move"
        style={{ maxWidth: "800px" }}
      />
    </div>
  );
};

export default FamilyNetworkGraph;
