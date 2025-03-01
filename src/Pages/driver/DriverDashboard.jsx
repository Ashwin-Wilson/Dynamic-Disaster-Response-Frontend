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
  const [destinaitonLoc, setDestinationLoc] = useState({
    lat: 9.860771771592113,
    lng: 76.94740113380533,
  });
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
        console.log("Driver availablity updated ");
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

          <MapView destinaitonLoc={destinaitonLoc} />
        </div>

        {/* Pickup Requests */}
        <div className="lg:col-span-3">
          <div className="bg-[#1e2538] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Pickup Requests</h3>
            <div className="grid grid-cols-2 ">
              <FamilyListView setDestinationLoc={setDestinationLoc} />
              <ShelterListView setDestinationLoc={setDestinationLoc} />
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
const MapView = ({ destinaitonLoc }) => {
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
  const [shelterLoc, setShelterLoc] = useState({
    lng: 76.94006268199648,
    lat: 9.851076591262078,
  });

  const [routeCoords, setRouteCoords] = useState(null);
  const [olaMaps, setOlaMaps] = useState(null);
  const [globalMap, setGlobalMap] = useState(null);

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

  //creating an instance for olaMaps
  useEffect(() => {
    setOlaMaps(
      new OlaMaps({
        apiKey: MAP_API_KEY,
      })
    );
  }, []);

  //initializing the global map when the olaMaps instance is ready
  useEffect(() => {
    if (olaMaps) {
      setGlobalMap(
        olaMaps.init({
          style:
            "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
          container: "map",
          center: [driverLoc.lng, driverLoc.lat],
          zoom: 15,
          branding: false,
        })
      );
    }
  }, [olaMaps]);

  //adding draggable diver marker
  useEffect(() => {
    if (globalMap) {
      const dMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

      const driverMarker = olaMaps
        .addMarker({
          element: dMarker,
          offset: [0, 6],
          anchor: "bottom",
          draggable: true,
        })
        .setLngLat([driverLoc.lng, driverLoc.lat])
        .addTo(globalMap);

      driverMarker.on("dragend", () => {
        const lngLat = driverMarker.getLngLat();
        globalMap.setCenter([lngLat.lng, lngLat.lat]);
        setDriverLoc(lngLat);
      });

      const geolocate = olaMaps.addGeolocateControls({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      });

      globalMap.addControl(geolocate);

      geolocate.on("geolocate", async (event) => {
        setDriverLoc({
          lng: event.coords.longitude,
          lat: event.coords.latitude,
        });
      });
    }
  }, [globalMap]);

  //Updating the driver location in DB and getting the route on driver location change
  useEffect(() => {
    axios
      .post(
        `https://api.olamaps.io/routing/v1/directions?origin=${driverLoc.lat},${driverLoc.lng}&destination=${destinaitonLoc.lat},${destinaitonLoc.lng}&api_key=${MAP_API_KEY}`
      )
      .then((response) => {
        const encodedString = response.data.routes[0].overview_polyline;
        const coords = polyline.decode(encodedString);
        setRouteCoords([
          ...coords.map((item) => {
            return {
              lng: item[1],
              lat: item[0],
            };
          }),
        ]);
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .post(`${BASE_URL}/driver/update`, {
        token: localStorage.getItem("driverToken"),
        updates: { location: { coordinates: [driverLoc.lng, driverLoc.lat] } },
      })
      .then((response) => {
        console.log("Driver location updated ");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [driverLoc, destinaitonLoc]);

  //Adding the markers and routes in the global map
  useEffect(() => {
    if (olaMaps && globalMap && routeCoords) {
      globalMap.on("load", () => {
        //To add multiple disaster markers, marker clustering
        globalMap.addSource("disaster-area", {
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
        globalMap.addLayer({
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
        globalMap.addLayer({
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
        globalMap.addSource("families", {
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
        globalMap.addLayer({
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
        globalMap.addLayer({
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

        //To add multiple shelters markers, marker clustering
        globalMap.addSource("shelters", {
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
        globalMap.addLayer({
          id: "shelters-clusters",
          type: "circle",
          source: "shelters",
          filter: ["has", "point_count"],

          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "green",
              2,
              "green",
            ],
            "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
          },
        });

        //Color in closer view
        globalMap.addLayer({
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

        globalMap.addSource("route", {
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

        globalMap.addLayer({
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

      globalMap.on("moveend", () => {
        globalMap.removeLayer("route");
        globalMap.removeSource("route");
        globalMap.addSource("route", {
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

        globalMap.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
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
          paint: {
            "line-color": "orange",
            "line-width": 4,
          },
        });
      });
    }
  }, [
    familyLoc,
    disasterLocation,
    shelterLoc,
    olaMaps,
    globalMap,
    routeCoords,
  ]);

  return <div id="map" style={{ height: "40rem", width: "50rem" }}></div>;
};

export default DriverDashboard;

const FamilyListView = ({ setDestinationLoc }) => {
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
      <p>Click the family to get the direction towards them: </p>
      <div className="grid gap-4">
        {sortedFamilies.map((family, index) => (
          <div
            key={family._id}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 relative"
            onClick={() => {
              // console.log(family.address.location);
              setDestinationLoc({
                lng: family.address.location.coordinates[0],
                lat: family.address.location.coordinates[1],
              });
            }}
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

const ShelterListView = ({ setDestinationLoc }) => {
  const [shelters, setShelters] = useState(null);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/driver/get-all-shelters`)
      .then((response) => {
        setShelters(response.data.Shelters);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h2 className="text-4xl font-bold text-white mb-6">Shelters List View</h2>
      {shelters &&
        shelters.map((shelter, index) => (
          <div
            key={shelter._id}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-slate-600 hover:bg-slate-800/70 transition-all duration-300 relative"
            onClick={() => {
              // console.log(family.address.location);
              setDestinationLoc({
                lng: shelter.address.location.coordinates[0],
                lat: shelter.address.location.coordinates[1],
              });
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold text-gray-400">Shelter Name</h3>
                <p className="text-white">{shelter.shelter_name}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-400">Location</h3>
                <p className="text-white">
                  {shelter.address.city}, {shelter.address.state}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-400">Occupancy</h3>
                <p className="text-white">
                  {shelter.capacity.current_occupancy}/
                  {shelter.capacity.max_capacity}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-400">Supply Status</h3>

                <p className="text-white">Food:{shelter.supply_status.food}</p>

                <p className="text-white">
                  Water: {shelter.supply_status.water}
                </p>
                <p className="text-white">
                  Medicine: {shelter.supply_status.medicine}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-gray-400">Sanitaiton</h3>
                <p className="text-white">{shelter.sanitation}</p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
