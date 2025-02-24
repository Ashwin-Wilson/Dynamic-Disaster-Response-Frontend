import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { OlaMaps } from "../../../OlaMapsWebSDKNew";
import polyline from "@mapbox/polyline";

import axios from "axios";

import {
  MapPin,
  Car,
  Users,
  Bell,
  Settings,
  LogOut,
  Navigation2,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(false);
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      user: "Gokul Gk",
      pickup: "Manakala",
      destination: "Centeral Community Adoor",
      passengers: 3,
      status: "Pending",
    },
    {
      id: 2,
      user: "Manas Kumar",
      pickup: "Pathnamthitta",
      destination: "Holycross Hospital",
      passengers: 2,
      status: "Pending",
    },
    {
      id: 3,
      user: "Santhosh giri",
      pickup: "Bharanikavu",
      destination: "East District School",
      passengers: 4,
      status: "Pending",
    },
  ]);

  const toggleShift = () => {
    setIsOnline(!isOnline);
  };

  const handleRequestAction = (requestId, action) => {
    setActiveRequests((requests) =>
      requests.map((request) =>
        request.id === requestId ? { ...request, status: action } : request
      )
    );
  };

  useEffect(() => {
    axios
      .post(`${BASE_URL}/driver/update`, {
        token: localStorage.getItem("driverToken"),
        updates: { available: isOnline },
      })
      .then((response) => {
        console.log("Driver availablity updated ", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      {/* Header */}
      <header className="bg-[#1e2538] p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Car className="text-yellow-500 w-8 h-8" />
            <h1 className="text-2xl font-bold">Driver Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer" />
            <LogOut
              className="w-6 h-6 text-gray-400 hover:text-yellow-500 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Driver Info & Vehicle Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-[#1a1f2e]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {localStorage.getItem("driverName") ?? "Thomas"}
                </h2>
                <p className="text-gray-400">Vehicle: Toyota Hiace</p>
                <p className="text-gray-400">
                  No:{localStorage.getItem("driverVehicleNum") ?? "KL-26-24001"}
                </p>
                <div
                  className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                    isOnline
                      ? "bg-green-500/20 text-green-500"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></span>
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button
                onClick={toggleShift}
                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                  isOnline
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "bg-yellow-500 text-[#1a1f2e] hover:bg-yellow-400"
                }`}
              >
                {isOnline ? "Stop Shift" : "Start Shift"}
              </button>
              <button className="w-full bg-red-500/10 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-500/20 transition-colors">
                Report Vehicle Issue
              </button>
            </div>
          </div>

          {/* Vehicle Status */}
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Vehicle Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Fuel Level</span>
                <div className="w-32 h-2 bg-gray-700 rounded-full">
                  <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Tire condition</span>
                <div className="w-32 h-2 bg-gray-700 rounded-full">
                  <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Maintenance</span>
                <span className="text-green-500">Good Condition</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Last Inspection</span>
                <span className="text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Map */}
        <div className="lg:col-span-2 bg-[#1e2538] rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Route Map</h3>
            <button className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors">
              <Navigation2 className="w-4 h-4" />
              Navigate
            </button>
          </div>
          {/* Just a Temp Placeholder for map */}
          {/* <div className="relative h-[400px] bg-gray-800 rounded-lg overflow-hidden">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L100,100 M100,0 L0,100"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
              <circle cx="30" cy="40" r="2" fill="#4CAF50" />
              <circle cx="70" cy="60" r="2" fill="#F44336" />
              <path
                d="M30,40 Q50,50 70,60"
                stroke="#FFD700"
                strokeWidth="0.5"
                fill="none"
              />
            </svg>
            <div className="absolute bottom-4 right-4 bg-[#1a1f2e] p-3 rounded-lg shadow-lg">
              <p className="text-sm">Nearest Shelter: 2.5 km</p>
              <p className="text-xs text-gray-400">Est. time: 8 mins</p>
            </div>
          </div> */}
          <MapView />
        </div>

        {/* Pickup Requests */}
        <div className="lg:col-span-3">
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Pickup Requests</h3>
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    request.status === "Pending"
                      ? "border-gray-700 hover:border-yellow-500/50"
                      : request.status === "Accepted"
                      ? "border-green-500/50 bg-green-500/5"
                      : "border-red-500/50 bg-red-500/5"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{request.user}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.pickup}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <Users className="w-4 h-4" />
                        <span>{request.passengers} passengers</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {request.status === "Pending" ? (
                        <>
                          <button
                            onClick={() =>
                              handleRequestAction(request.id, "Accepted")
                            }
                            className="bg-green-500/10 text-green-500 px-4 py-2 rounded-lg hover:bg-green-500/20 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(request.id, "Declined")
                            }
                            className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span
                          className={`px-4 py-2 rounded-lg ${
                            request.status === "Accepted"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {request.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

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

//local components
const MapView = () => {
  //map dependencies
  const [disasterLocation, setDisasterLocation] = useState([
    {
      lng: 76.94006268199648,
      lat: 9.851076591262078,
    },
    {
      lng: 76.98006268199648,
      lat: 9.851076591262078,
    },
  ]);
  const [familyLoc, setFamilyLoc] = useState([
    {
      lng: 76.94006268199648,
      lat: 9.851076591262078,
    },
  ]);
  const [driverLoc, setDriverLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });

  const [routeCoords, setRouteCoords] = useState(null);
  const [originLoc, setOriginLoc] = useState(null);
  const [distinaitonLoc, setDestinationLoc] = useState(null);

  useEffect(() => {
    axios
      .post(
        `https://api.olamaps.io/routing/v1/directions?origin=${driverLoc.lat},${driverLoc.lng}&destination=9.860771771592113,76.94740113380533&api_key=${MAP_API_KEY}`
      )
      .then((response) => {
        const encodedString = response.data.routes[0].overview_polyline;
        const coords = polyline.decode(encodedString);
        // setRouteCoords();
        setRouteCoords([
          ...coords.map((item) => {
            return {
              lng: item[1],
              lat: item[0],
            };
          }),
        ]);
        // console.log(...coords);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${BASE_URL}/admin/get-all-disaster-reports`)
      .then((response) => {
        setDisasterLocation(
          response.data.disasterReports.map((item) => {
            return {
              lng: item.location.coordinates[0],
              lat: item.location.coordinates[1],
            };
          })
        );
        // console.log(response.data.disasterReports);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${BASE_URL}/admin/get-all-families`)
      .then((response) => {
        setFamilyLoc([
          ...response.data.families.map((item) => {
            return {
              lng: item.address.location.coordinates[0],
              lat: item.address.location.coordinates[1],
            };
          }),
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [driverLoc]);

  useEffect(() => {
    const dMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

    const olaMaps = new OlaMaps({
      apiKey: MAP_API_KEY,
    });

    const myMap = olaMaps.init({
      style:
        "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      container: "map",
      center: [disasterLocation[0].lng, disasterLocation[0].lat],
      zoom: 15,
      branding: false,
    });

    const driverMarker = olaMaps
      .addMarker({
        element: dMarker,
        offset: [0, 6],
        anchor: "bottom",
        draggable: true,
      })
      .setLngLat([driverLoc.lng, driverLoc.lat])
      .addTo(myMap);

    driverMarker.on("dragend", () => {
      const lngLat = driverMarker.getLngLat();
      setDriverLoc(lngLat);
    });

    myMap.on("load", () => {
      //To add multiple disaster markers, marker clustering
      myMap.addSource("disaster-area", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: disasterLocation.map((item) => {
            return {
              geometry: {
                type: "Point",
                coordinates: [item.lng, item.lat],
              },
            };
          }),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      //Color in wider view
      myMap.addLayer({
        id: "clusters",
        type: "circle",
        source: "disaster-area",
        filter: ["has", "point_count"],

        paint: {
          "circle-color": ["step", ["get", "point_count"], "red", 2, "red"],
          "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
        },
      });

      //Color in closer view
      myMap.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "disaster-area",
        filter: ["!", ["has", "point_count"]],

        paint: {
          "circle-color": "red",
          "circle-radius": 20,
          "circle-stroke-width": 1,
          "circle-stroke-color": "red",
        },
      });

      //To add multiple families markers, marker clustering
      myMap.addSource("families", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: familyLoc.map((item) => {
            return {
              geometry: {
                type: "Point",
                coordinates: [item.lng, item.lat],
              },
            };
          }),
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      //Color in wider view
      myMap.addLayer({
        id: "family-clusters",
        type: "circle",
        source: "families",
        filter: ["has", "point_count"],

        paint: {
          "circle-color": ["step", ["get", "point_count"], "blue", 2, "blue"],
          "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
        },
      });

      //Color in closer view
      myMap.addLayer({
        id: "family-unclustered-point",
        type: "circle",
        source: "families",
        filter: ["!", ["has", "point_count"]],

        paint: {
          "circle-color": "blue",
          "circle-radius": 20,
          "circle-stroke-width": 1,
          "circle-stroke-color": "blue",
        },
      });

      //Adding connector lines between disaster and families
      myMap.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: [
              ...routeCoords.map((item) => {
                return [item.lng, item.lat];
              }),
            ],
          },
        },
      });

      myMap.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "orange",
          "line-width": 4,
        },
      });
    });
  }, [disasterLocation, familyLoc, routeCoords]);
  return <div id="map" style={{ height: "40rem", width: "50rem" }}></div>;
};

export default DriverDashboard;
