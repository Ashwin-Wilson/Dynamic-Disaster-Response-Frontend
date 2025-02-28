import { useState, useEffect, useRef } from "react";
import { OlaMaps } from "../../OlaMapsWebSDKNew";
import axios from "axios";
import {
  BuildingIcon,
  MapPinIcon,
  Users,
  Bed,
  Thermometer,
  Package,
  Droplet,
} from "lucide-react";

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
  innerCircle.className = `absolute inset-2 rounded-full ${color1} `;

  // Append circles to marker
  customMarker.appendChild(outerCircle);
  customMarker.appendChild(innerCircle);

  return customMarker;
};

const ShelterManagementForm = ({
  onClose,
  shelterId,
  isUpdate,
  setShelterDetails,
}) => {
  const [mapMarker, setMapMarker] = useState(null);
  const [olaMap, setOlaMap] = useState(null);
  const [rMarkerLoc, setRMarkerLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });
  const [showLocationFields, setShowLocationFields] = useState(!isUpdate);

  const [formData, setFormData] = useState({
    shelter_name: "",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      location: {
        coordinates: [],
      },
    },
    capacity: {
      max_capacity: "",
      current_occupancy: 0,
      available_beds: "",
    },
    medical_cases: {
      count: 0,
      details: [],
    },
    supply_status: {
      food: 100,
      water: 100,
      medicine: 100,
      other_supplies: 100,
    },
    sanitation: "good",
    status: "preparing",
    assigned_caretaker: { caretakerId: localStorage.getItem("caretakerId") },
  });

  // For medical case details
  const [medicalCaseDetail, setMedicalCaseDetail] = useState({
    case_type: "",
    severity: "low",
    count: 1,
  });

  // Load existing shelter data if updating
  useEffect(() => {
    if (isUpdate && shelterId) {
      const fetchShelterData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/caretaker/shelter`, {
            headers: { shelterId: shelterId },
          });
          const shelterData = response.data;

          setFormData(shelterData.shelter);

          if (shelterData.address && shelterData.address.location) {
            setRMarkerLoc({
              lng: shelterData.address.location.coordinates[0],
              lat: shelterData.address.location.coordinates[1],
            });
          }
        } catch (error) {
          console.error("Error fetching shelter data:", error);
        }
      };

      fetchShelterData();
    }
  }, [isUpdate, shelterId]);

  // Initialize map when location fields are shown
  useEffect(() => {
    if (!showLocationFields) return;

    const initializeMap = () => {
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

      const purpleMarker = createCustomMarker(
        "bg-purple-600",
        "bg-purple-400/50"
      );

      const rMarker = olaMaps
        .addMarker({
          element: purpleMarker,
          offset: [0, 6],
          anchor: "bottom",
          draggable: true,
        })
        .setLngLat([rMarkerLoc.lng, rMarkerLoc.lat])
        .addTo(myMap);

      setMapMarker(rMarker);

      function onDrag() {
        const lngLat = rMarker.getLngLat();
        setRMarkerLoc(lngLat);
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
        await rMarker.setLngLat([
          event.coords.longitude,
          event.coords.latitude,
        ]);
        setRMarkerLoc({
          lng: event.coords.longitude,
          lat: event.coords.latitude,
        });
      });
    };

    // Add a small delay to ensure the DOM element is ready
    const timer = setTimeout(() => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        initializeMap();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [showLocationFields]);

  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleCapacityChange = (e) => {
    setFormData({
      ...formData,
      capacity: {
        ...formData.capacity,
        [e.target.name]: Number(e.target.value),
      },
    });
  };

  const handleSupplyChange = (e) => {
    setFormData({
      ...formData,
      supply_status: {
        ...formData.supply_status,
        [e.target.name]: Number(e.target.value),
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMedicalDetailChange = (e) => {
    setMedicalCaseDetail({
      ...medicalCaseDetail,
      [e.target.name]:
        e.target.name === "count" ? Number(e.target.value) : e.target.value,
    });
  };

  const addMedicalCase = () => {
    if (!medicalCaseDetail.case_type) return;

    const updatedDetails = [
      ...formData.medical_cases.details,
      medicalCaseDetail,
    ];
    const totalCount = updatedDetails.reduce(
      (sum, detail) => sum + detail.count,
      0
    );

    setFormData({
      ...formData,
      medical_cases: {
        count: totalCount,
        details: updatedDetails,
      },
    });

    // Reset medical case detail form
    setMedicalCaseDetail({
      case_type: "",
      severity: "low",
      count: 1,
    });
  };

  const removeMedicalCase = (index) => {
    const updatedDetails = [...formData.medical_cases.details];
    updatedDetails.splice(index, 1);

    const totalCount = updatedDetails.reduce(
      (sum, detail) => sum + detail.count,
      0
    );

    setFormData({
      ...formData,
      medical_cases: {
        count: totalCount,
        details: updatedDetails,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add location coordinates if location fields are shown
    if (showLocationFields) {
      formData.address.location.coordinates = [rMarkerLoc.lng, rMarkerLoc.lat];
    }

    try {
      if (isUpdate) {
        await axios
          .post(`${BASE_URL}/caretaker/shelter/update`, {
            updates: formData,
            shelterId,
          })
          .then((response) => {
            setShelterDetails(response.data.shelter);

            console.log("Shelter details updated successfully!");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        await axios
          .post(`${BASE_URL}/caretaker/shelter/create`, formData)
          .then((response) => {
            localStorage.setItem("shelterId", response.data.shelterId);
            console.log("Shelter created successfully");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      onClose();
    } catch (error) {
      console.error("Error saving shelter data:", error);
      // Handle error - show message to user
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-lg w-full mx-4 max-h-[90vh] overflow-y-auto flex flex-col lg:flex-row gap-4 p-4">
        {/* Left side - Map (conditionally rendered) */}
        {showLocationFields && (
          <div className="flex-1">
            <SearchBar
              mapMarker={mapMarker}
              olaMap={olaMap}
              setRMarkerLoc={setRMarkerLoc}
            />
            <p className="text-gray-300 text-sm mt-1 mb-2">
              Drag the marker to select the exact shelter location
            </p>
            <div id="map" style={{ height: "35rem", width: "100%" }}></div>
          </div>
        )}
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
        {/* Right side - Form */}
        <div className={`${showLocationFields ? "flex-1" : "w-full"} relative`}>
          {/* Close button */}

          {/* Form */}
          <form className="space-y-4 mt-2" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-white mb-6 text-center relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-24 after:h-1 after:bg-purple-600 after:rounded-full">
              {isUpdate ? "Update Shelter" : "Register New Shelter"}
            </h1>

            {/* Basic Info Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <BuildingIcon className="text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Shelter Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter shelter name"
                    name="shelter_name"
                    value={formData.shelter_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Location Update Button for Update mode */}
                {isUpdate && !showLocationFields && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="flex items-center bg-purple-600/30 hover:bg-purple-600/50 text-white px-4 py-2 rounded-lg"
                      onClick={() => setShowLocationFields(true)}
                    >
                      <MapPinIcon className="mr-2" size={18} />
                      Update Location Information
                    </button>
                  </div>
                )}

                {/* Address fields (shown conditionally) */}
                {showLocationFields && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-200 mb-2">
                          Street
                        </label>
                        <input
                          type="text"
                          className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter street address"
                          name="street"
                          value={formData.address.street}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-200 mb-2">City</label>
                        <input
                          type="text"
                          className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter city"
                          name="city"
                          value={formData.address.city}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-200 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter state"
                          name="state"
                          value={formData.address.state}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-200 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                          placeholder="Enter postal code"
                          name="postal_code"
                          value={formData.address.postal_code}
                          onChange={handleAddressChange}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-200 mb-2">
                        Coordinates
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                        value={
                          rMarkerLoc
                            ? `${rMarkerLoc.lat}, ${rMarkerLoc.lng}`
                            : ""
                        }
                        readOnly
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Capacity Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Users className="text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Capacity Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Maximum Capacity
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter maximum capacity"
                    name="max_capacity"
                    value={formData.capacity.max_capacity}
                    onChange={handleCapacityChange}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Current Occupancy
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter current occupancy"
                    name="current_occupancy"
                    value={formData.capacity.current_occupancy}
                    onChange={handleCapacityChange}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Available Beds
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    placeholder="Enter available beds"
                    name="available_beds"
                    value={formData.capacity.available_beds}
                    onChange={handleCapacityChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medical Cases Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Thermometer className="text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Medical Cases
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Case Type
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                        placeholder="e.g. Injury, Illness"
                        name="case_type"
                        value={medicalCaseDetail.case_type}
                        onChange={handleMedicalDetailChange}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">
                        Severity
                      </label>
                      <select
                        className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                        name="severity"
                        value={medicalCaseDetail.severity}
                        onChange={handleMedicalDetailChange}
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-200 mb-2">Count</label>
                      <div className="flex">
                        <input
                          type="number"
                          className="w-full bg-slate-800 rounded-l-lg px-4 py-2 text-white"
                          placeholder="Number of cases"
                          name="count"
                          value={medicalCaseDetail.count}
                          onChange={handleMedicalDetailChange}
                          min="1"
                        />
                        <button
                          type="button"
                          onClick={addMedicalCase}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-r-lg"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* List of added medical cases */}
                {formData.medical_cases.details.length > 0 && (
                  <div className="bg-slate-700/30 p-3 rounded-lg">
                    <h3 className="text-white font-medium mb-2">
                      Current Medical Cases:
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.medical_cases.details.map((detail, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-slate-800/80 p-2 rounded"
                        >
                          <div>
                            <span className="text-white">
                              {detail.case_type}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span
                              className={`
                              ${
                                detail.severity === "low"
                                  ? "text-green-400"
                                  : ""
                              }
                              ${
                                detail.severity === "moderate"
                                  ? "text-yellow-400"
                                  : ""
                              }
                              ${
                                detail.severity === "high"
                                  ? "text-orange-400"
                                  : ""
                              }
                              ${
                                detail.severity === "critical"
                                  ? "text-red-400"
                                  : ""
                              }
                            `}
                            >
                              {detail.severity}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-white">
                              {detail.count} cases
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMedicalCase(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-right text-gray-300">
                      Total: {formData.medical_cases.count} cases
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Supply Status Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Package className="text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Supply Status (%)
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">Food</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-purple-500"
                      name="food"
                      value={formData.supply_status.food}
                      onChange={handleSupplyChange}
                    />
                    <span className="absolute right-0 top-0 text-white">
                      {formData.supply_status.food}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Water</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-purple-500"
                      name="water"
                      value={formData.supply_status.water}
                      onChange={handleSupplyChange}
                    />
                    <span className="absolute right-0 top-0 text-white">
                      {formData.supply_status.water}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">Medicine</label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-purple-500"
                      name="medicine"
                      value={formData.supply_status.medicine}
                      onChange={handleSupplyChange}
                    />
                    <span className="absolute right-0 top-0 text-white">
                      {formData.supply_status.medicine}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Other Supplies
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-purple-500"
                      name="other_supplies"
                      value={formData.supply_status.other_supplies}
                      onChange={handleSupplyChange}
                    />
                    <span className="absolute right-0 top-0 text-white">
                      {formData.supply_status.other_supplies}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Sanitation Section */}
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <div className="flex items-center mb-4">
                <Droplet className="text-purple-500 mr-2" />
                <h2 className="text-xl font-semibold text-white">
                  Status Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-200 mb-2">
                    Shelter Status
                  </label>
                  <select
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value="preparing">Preparing</option>
                    <option value="active">Active</option>
                    <option value="full">Full</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-200 mb-2">
                    Sanitation Level
                  </label>
                  <select
                    className="w-full bg-slate-800 rounded-lg px-4 py-2 text-white"
                    name="sanitation"
                    value={formData.sanitation}
                    onChange={handleChange}
                    required
                  >
                    <option value="good">Good</option>
                    <option value="moderate">Moderate</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg"
            >
              {isUpdate ? "Update Shelter" : "Register Shelter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SearchBar = ({ mapMarker, olaMap, setRMarkerLoc }) => {
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
      await setRMarkerLoc({ lng, lat });
    }
  };

  return (
    <div className="relative w-full" ref={searchRef}>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for shelter location..."
        className="w-full px-4 py-2 text-white bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      {/* Loading spinner */}
      {loading && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
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

export default ShelterManagementForm;
