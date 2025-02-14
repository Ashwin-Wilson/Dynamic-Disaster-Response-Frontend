import { useEffect } from "react";
import { OlaMaps } from "../../OlaMapsWebSDKNew";
import { useState } from "react";

const createCustomMarker = (color1, color2) => {
  // Create the main container
  var customMarker = document.createElement("div");
  customMarker.className = "relative w-10 h-10 rounded-full animate-pulse";

  // Create outer circle
  var outerCircle = document.createElement("div");
  outerCircle.className = `absolute inset-0 rounded-full ${color2} `;

  // Create inner circle
  var innerCircle = document.createElement("div");
  innerCircle.className = `absolute inset-2 rounded-full  ${color1} `;

  // Append circles to marker
  customMarker.appendChild(outerCircle);
  customMarker.appendChild(innerCircle);

  return customMarker;
};

const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const DisasterReportForm = () => {
  const [rMarkerLoc, setrMarkerLoc] = useState("");
  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: MAP_API_KEY,
    });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "map",
      center: [76.94006268199648, 9.851076591262078],
      zoom: 15,
      branding: false,
    });

    const redMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

    const rMarker = olaMaps
      .addMarker({
        element: redMarker,
        offset: [0, 6],
        anchor: "bottom",
        draggable: true,
      })
      .setLngLat([76.94006268199648, 9.851076591262078])
      .addTo(myMap);

    function onDrag() {
      const lngLat = rMarker.getLngLat();
      setrMarkerLoc(lngLat);
      // console.log(lngLat);
    }
    rMarker.on("drag", onDrag);
  }, []);

  // custom marker
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-slate-900 rounded-lg w-full  mx-4 max-h-[90vh] overflow-y-auto ">
        <div id="map" style={{ height: "40rem", width: "50rem" }}></div> <br />
        <button
          onClick={() => {
            console.log(rMarkerLoc);
          }}
        >
          Select location
        </button>
      </div>
    </div>
  );
};

export default DisasterReportForm;
