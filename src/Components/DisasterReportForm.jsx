import { useState, useEffect, useRef } from "react";
import { OlaMaps } from "../../OlaMapsWebSDKNew";
import axios from "axios";
import { AwardIcon } from "lucide-react";

const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

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

const DisasterReportForm = ({ onClose, role }) => {
  const [mapMarker, setMapMarker] = useState(null);
  const [olaMap, setOlaMap] = useState(null);
  const [rMarkerLoc, setrMarkerLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });

  const [formData, setFormData] = useState({
    disaster_title: "",
    description: "",
    author: {
      role: "admin",
      id: localStorage.getItem("adminID"),
    },
    location: { coordinates: [] },
    intensity: "",
  });

  useEffect(() => {
    const olaMaps = new OlaMaps({
      apiKey: MAP_API_KEY,
    });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "map",
      center: [rMarkerLoc.lng, rMarkerLoc.lat],
      zoom: 15,
      branding: false,
    });
    setOlaMap(myMap);
    const redMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

    const rMarker = olaMaps
      .addMarker({
        element: redMarker,
        offset: [0, 6],
        anchor: "bottom",
        draggable: true,
      })
      .setLngLat([rMarkerLoc.lng, rMarkerLoc.lat])
      .addTo(myMap);

    setMapMarker(rMarker);

    function onDrag() {
      const lngLat = rMarker.getLngLat();
      setrMarkerLoc(lngLat);
    }
    rMarker.on("drag", onDrag);

    const geolocate = olaMaps.addGeolocateControls({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    myMap.addControl(geolocate);

    geolocate.on("geolocate", async (event) => {
      await rMarker.setLngLat([event.coords.longitude, event.coords.latitude]);
      setrMarkerLoc({
        lng: event.coords.longitude,
        lat: event.coords.latitude,
      });
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.location.coordinates = [rMarkerLoc.lng, rMarkerLoc.lat];

    try {
      axios.post(`${BASE_URL}/admin/report-disaster`, {
        ...formData,
      });
    } catch (error) {
      console.log(error);
    }
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // custom marker
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg w-full mx-4 max-h-[90vh] overflow-y-auto flex gap-4 p-4">
        {/* Left side - Map */}
        <div className="flex-1">
          <SearchBar
            mapMarker={mapMarker}
            olaMap={olaMap}
            setrMarkerLoc={setrMarkerLoc}
          />
          <p> Drag the marker to select other locations</p>
          <div id="map" style={{ height: "40rem", width: "100%" }}></div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 relative">
          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Form */}
          <form className="space-y-4 mt-8" onSubmit={handleSubmit}>
            <h1 className="text-3xl  font-bold text-white mb-6 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-blue-600 after:rounded-full">
              Disaster Report Form
            </h1>
            <div>
              <label className="block text-gray-200 mb-2">Disaster Title</label>
              <input
                type="text"
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                placeholder="Enter disaster title"
                name="disaster_title"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2">Description</label>
              <textarea
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white h-32"
                placeholder="Enter description"
                name="description"
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2">Location</label>
              <input
                type="text"
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                value={rMarkerLoc ? `${rMarkerLoc.lat}, ${rMarkerLoc.lng}` : ""}
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2">Intensity</label>
              <select
                className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                name="intensity"
                onChange={handleChange}
                required
              >
                <option value="">Select intensity</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="severe">Severe</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ mapMarker, olaMap, setrMarkerLoc }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
          input
        )}&api_key=${MAP_API_KEY}`
      );
      setSuggestions(response.data.predictions || []);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Debounce API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = async (suggestion) => {
    setSearchTerm(suggestion.description);
    setIsOpen(false);

    // You can handle the selected location here
    const lng = suggestion.geometry.location.lng;
    const lat = suggestion.geometry.location.lat;

    // Update marker position
    if (mapMarker) {
      await mapMarker.setLngLat([lng, lat]);
      await olaMap.setCenter([lng, lat]);
      await setrMarkerLoc({ lng, lat });
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for a location..."
        className="w-full px-4 py-2 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-12 w-full bg-slate-800 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full px-4 py-2 text-left text-white hover:bg-slate-700 focus:outline-none focus:bg-slate-700"
            >
              <p className="font-medium">
                {suggestion.structured_formatting?.main_text}
              </p>
              <p className="text-sm text-gray-400">
                {suggestion.structured_formatting?.secondary_text}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DisasterReportForm;
