import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OlaMaps } from "../../../OlaMapsWebSDKNew";
import polyline from "@mapbox/polyline";

import axios from "axios";

import {
  Bell,
  Settings,
  LogOut,
  MapPin,
  AlertTriangle,
  Navigation2,
  Building2,
  Users,
  Truck,
  Ambulance,
} from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

const VolunteerDashboard = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(true);
  // const [shelters] = useState([
  //   {
  //     id: 1,
  //     name: "Central Community Adoor",
  //     capacity: "234/500",
  //     volunteers: 6,
  //     status: "Available",
  //   },
  //   {
  //     id: 2,
  //     name: "East District School",
  //     capacity: "100/100",
  //     volunteers: 6,
  //     status: "Unavailable",
  //   },
  //   {
  //     id: 3,
  //     name: "Holycross Hospital",
  //     capacity: "259/350",
  //     volunteers: 12,
  //     status: "Available",
  //   },
  // ]);

  const [disaterReport, setDisasterReport] = useState(null);
  const [familyCount, setFamilyCount] = useState(3);
  const [driverCount, setDriverCount] = useState(3);
  const [shelters, setShelters] = useState(null);
  const [shelterCount, setShelterCount] = useState(3);

  const [alerts] = useState([
    {
      id: 1,
      type: "Disaster",
      location: "North District",
      description: "Flooding reported in low-lying areas",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "Route Blockage",
      location: "Main Street Bridge",
      description: "Road blocked due to fallen trees",
      time: "10 minutes ago",
    },
    {
      id: 3,
      type: "Disaster",
      location: "East Zone",
      description: "Power outage affecting multiple blocks",
      time: "15 minutes ago",
    },
    {
      id: 4,
      type: "Route Blockage",
      location: "Highway Junction",
      description: "Traffic congestion due to accident",
      time: "25 minutes ago",
    },
    {
      id: 5,
      type: "Disaster",
      location: "South District",
      description: "Gas leak reported in residential area",
      time: "30 minutes ago",
    },
  ]);

  const stats = [
    {
      title: "Total Evacuee",
      count: `${familyCount}`,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20",
    },
    {
      title: "Volunteers",
      count: "478",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20",
    },
    {
      title: "Shelters",
      count: `${shelterCount}`,
      icon: Building2,
      color: "text-green-500",
      bgColor: "bg-green-500/20",
    },
    {
      title: "Ambulances",
      count: "57",
      icon: Ambulance,
      color: "text-red-500",
      bgColor: "bg-red-500/20",
    },
    {
      title: "Drivers",
      count: `${driverCount}`,
      icon: Truck,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/20",
    },
  ];

  function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    // Format date: Month Day, Year
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format time: Hours:Minutes AM/PM
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formattedDate} at ${formattedTime}`;
  }

  useEffect(() => {
    axios
      .get(`${BASE_URL}/admin/get-all-disaster-reports`)
      .then((response) => {
        setDisasterReport(response.data.disasterReports);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    axios.get(`${BASE_URL}/admin/get-all-families`).then((response) => {
      // console.log(response.data.families);
      setFamilyCount(response.data.families.length);
    });

    axios.get(`${BASE_URL}/admin/get-all-drivers`).then((response) => {
      setDriverCount(response.data.drivers.length);
    });
    axios.get(`${BASE_URL}/driver/get-all-shelters`).then((response) => {
      console.log(response.data.Shelters);
      setShelters(response.data.Shelters);
      setShelterCount(response.data.Shelters.length);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      {/* Header */}
      <header className="bg-[#1e2538] p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Users className="text-green-500 w-8 h-8" />
            <h1 className="text-2xl font-bold">Volunteer Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer" />
            <LogOut
              className="w-6 h-6 text-gray-400 hover:text-green-500 cursor-pointer"
              onClick={() => {
                navigate("/");
              }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="bg-[#1e2538] rounded-lg p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">{stat.title}</h3>
                  <p className="text-2xl font-bold">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Volunteer Info & Status */}
          <div className="space-y-6">
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-[#1a1f2e]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Sarath Sashi</h2>
                  <p className="text-gray-400">ID: VOL-2024-001</p>
                  <p className="text-gray-400">Area: North idukki</p>
                  <button
                    onClick={() => setIsActive(!isActive)}
                    className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      isActive
                        ? "bg-green-500/20 text-green-500"
                        : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    {isActive ? "Active" : "Offline"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-yellow-500/10 text-yellow-500 py-2 rounded-lg font-semibold hover:bg-yellow-500/20 transition-colors">
                  Report Route Blockage
                </button>
              </div>
            </div>

            {/* Alerts Section */}
            <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {disaterReport &&
                  disaterReport.map((item) => (
                    <div
                      key={item._id}
                      className="border border-gray-700 rounded-lg p-4 hover:border-red-500/50"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <h4 className="font-semibold text-red-500">
                              {item.disaster_title}
                            </h4>
                          </div>

                          <p className="text-sm text-gray-300 mt-2">
                            {item.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDateTime(item.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Map */}
          <div className="lg:col-span-2 bg-[#1e2538] rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Area Map</h3>
              <button className="flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors">
                <Navigation2 className="w-4 h-4" />
                Navigate
              </button>
            </div>

            <MapView />
          </div>
        </div>

        {/* Shelters List */}
        <div className="mt-6">
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Active Shelters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shelters &&
                shelters.map((shelter) => (
                  <div
                    key={shelter._id}
                    className="border border-gray-700 rounded-lg p-4 hover:border-green-500/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {shelter.shelter_name}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {shelter.capacity.current_occupancy}/
                              {shelter.capacity.max_capacity}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                            shelter.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {shelter.status}
                        </span>
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
  const [driverLoc, setDriverLoc] = useState([
    {
      lng: 76.94006268199648,
      lat: 9.851076591262078,
    },
  ]);

  const [shelterLoc, setShelterLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });

  useEffect(() => {
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
          ...familyLoc,
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
    axios
      .get(`${BASE_URL}/admin/get-all-drivers`)
      .then((response) => {
        setDriverLoc([
          ...response.data.drivers.map((item) => {
            return {
              lng: item.location.coordinates[0],
              lat: item.location.coordinates[1],
            };
          }),
        ]);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`${BASE_URL}/driver/get-all-shelters`)
      .then((response) => {
        setShelterLoc([
          ...response.data.Shelters.map((item) => {
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
  }, []);

  useEffect(() => {
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

      // /To add multiple driver markers, marker clustering
      myMap.addSource("drivers", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: driverLoc.map((item) => {
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
        id: "driver-clusters",
        type: "circle",
        source: "drivers",
        filter: ["has", "point_count"],

        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "yellow",
            2,
            "yellow",
          ],
          "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
        },
      });

      //Color in closer view
      myMap.addLayer({
        id: "driver-unclustered-point",
        type: "circle",
        source: "drivers",
        filter: ["!", ["has", "point_count"]],

        paint: {
          "circle-color": "yellow",
          "circle-radius": 20,
          "circle-stroke-width": 1,
          "circle-stroke-color": "yellow",
        },
      });

      //To add multiple shelters markers, marker clustering
      myMap.addSource("shelters", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: shelterLoc.map((item) => {
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
        id: "shelters-clusters",
        type: "circle",
        source: "shelters",
        filter: ["has", "point_count"],

        paint: {
          "circle-color": ["step", ["get", "point_count"], "green", 2, "green"],
          "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
        },
      });

      //Color in closer view
      myMap.addLayer({
        id: "shelters-unclustered-point",
        type: "circle",
        source: "shelters",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "green",
          "circle-radius": 20,
          "circle-stroke-width": 1,
          "circle-stroke-color": "green",
        },
      });
    });
  }, [disasterLocation, familyLoc]);
  return <div id="map" style={{ height: "40rem", width: "50rem" }}></div>;
};

export default VolunteerDashboard;
