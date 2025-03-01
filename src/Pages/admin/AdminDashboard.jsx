import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { OlaMaps } from "../../../OlaMapsWebSDKNew";

//Components
import FamilyNetworkGraph from "../../Components/FamilyNetworkGraph";
import FamilyListView from "../../Components/FamilyPriorityList";
import {
  Shield,
  Settings,
  Bell,
  LogOut,
  AlertTriangle,
  Users,
  Building2,
  Ambulance,
  Car,
  User,
} from "lucide-react";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DisasterReportForm from "../../Components/DisasterReportForm";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const MAP_API_KEY = import.meta.env.VITE_MAPS_API_KEY;

ChartJS.register(ArcElement, Tooltip, Legend);

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState(0);
  const [familyData, setFamilyData] = useState({
    within5km: { length: 3 },
    within10km: { length: 3 },
    within50km: { length: 3 },
  });
  const [familyCount, setFamilyCount] = useState(3);
  const [driverCount, setDriverCount] = useState(3);

  const [adminEmail, setAdminEmail] = useState("admin@gmail.com");
  const [viewDisasterReportForm, setViewDisasterReportForm] = useState(false);

  const [disasterReport, setDisasterReport] = useState(null);
  const [disasterCount, setDisasterCount] = useState(3);
  const [shelterCount, setShelterCount] = useState(3);
  const [report, setReport] = useState();

  useEffect(() => {
    const getAllDisasterReports = async () => {
      await axios
        .get(`${BASE_URL}/admin/get-all-disaster-reports`)
        .then((response) => {
          setDisasterReport(response.data.disasterReports);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    getAllDisasterReports();
    //fetching data
    setAdminEmail(localStorage.getItem("adminEmail"));
  }, []);

  useEffect(() => {
    const getDashboardData = () => {
      axios
        .get(`${BASE_URL}/admin/dashboard`, {
          headers: { disasterId: disasterReport[0]._id },
        })
        .then((response) => {
          setFamilyData(response.data.families);

          setReport(response.data);
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
        setShelterCount(response.data.Shelters.length);
      });
    };

    if (disasterReport) {
      setDisasterCount(disasterReport.length);
      getDashboardData();
    }
  }, [disasterReport]);

  const stats = [
    {
      title: "Active Alerts",
      value: `${disasterCount}`,
      icon: AlertTriangle,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      title: "Total Evacuee",
      value: `${familyCount}`,
      icon: Users,
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Shelters",
      value: `${shelterCount}`,
      icon: Building2,
      iconBg: "bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      title: "Volunteers",
      value: "478",
      icon: User,
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Ambulances",
      value: "57",
      icon: Ambulance,
      iconBg: "bg-red-500/20",
      iconColor: "text-red-500",
    },
    {
      title: "Pickup",
      value: `${driverCount}`,
      icon: Car,
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-500",
    },
  ];

  // data for Pie Chart
  const pieData = {
    labels: ["Within 5km", "Within 10km", "Within 50km"],
    datasets: [
      {
        label: "Statistics",
        data: [
          familyData.within5km.length ?? 3,
          familyData.within10km.length ?? 3,
          familyData.within50km.length ?? 3,
        ],
        backgroundColor: ["#f97316", "#facc15", "#4caf50"],
        borderWidth: 0,
        spacing: 2,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl text-gray-200">Admin Dashboard</h1>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <User className="w-6 h-6 text-gray-400" />
            <div>
              <p className="text-gray-200">Admin</p>
              <p className="text-sm text-gray-400">{adminEmail}</p>
            </div>
          </div>
          <Settings className="w-6 h-6 text-gray-400 cursor-pointer" />
          <Bell className="w-6 h-6 text-gray-400 cursor-pointer" />
          <LogOut
            className="w-6 h-6 text-gray-400 cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-slate-800/50 rounded-lg p-6 ">
          <button
            className="px-4 py-2 text-xl text-gray-200 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all duration-300 border border-slate-700 hover:border-slate-600 mr-4 mb-4"
            onClick={() => {
              setView(0);
            }}
          >
            Graphical view
          </button>

          <button
            className="px-4 py-2 text-xl text-gray-200 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all duration-300 border border-slate-700 hover:border-slate-600 mr-4 mb-4"
            onClick={() => {
              setView(1);
            }}
          >
            Map view
          </button>

          <button
            className="px-4 py-2 text-xl text-gray-200 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-all duration-300 border border-slate-700 hover:border-slate-600 mr-4 mb-4"
            onClick={() => {
              setView(2);
            }}
          >
            Family List view
          </button>

          {view === 0 && (
            <div className="grid grid-cols-2 gap-2 bg-slate-900 ">
              <div className="p-4 mt-7">
                <Pie data={pieData} />
              </div>
              <div className="p-4 ">
                {report && (
                  <FamilyNetworkGraph
                    disasterReport={report.disaster_report}
                    families={report.families}
                  />
                )}
              </div>
            </div>
          )}

          {view === 1 && <MapView disasterReport={disasterReport} />}

          {view === 2 && (
            <div className="h-[600px] overflow-y-auto rounded-lg">
              <FamilyListView />
            </div>
          )}
        </div>

        <div className="w-64 space-y-4">
          <div
            className="bg-slate-800/50 rounded-lg p-4 flex items-center space-x-4"
            onClick={() => {
              setViewDisasterReportForm(!viewDisasterReportForm);
            }}
          >
            <div className={`p-3 rounded-full bg-red-500/20`}>
              <AlertTriangle className={`w-6 h-6 text-red-500`} />
            </div>
            <div>
              <h3 className="text-gray-200">Report Disaster</h3>
              <p className="text-sm text-gray-400">Report incidents to users</p>
            </div>
          </div>

          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-800/50 rounded-lg p-4 flex items-center space-x-4"
            >
              <div className={`p-3 rounded-full ${stat.iconBg}`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <h3 className="text-gray-200">{stat.title}</h3>
                {stat.description ? (
                  <p className="text-sm text-gray-400">{stat.description}</p>
                ) : (
                  <p className="text-xl font-semibold text-gray-200">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {viewDisasterReportForm === true && (
        <DisasterReportForm
          onClose={() => setViewDisasterReportForm(false)}
          role="admin"
        />
      )}
    </div>
  );
};

//local components
const MapView = ({ disasterReport }) => {
  //map dependencies
  const [disasterLoc, setDisasterLoc] = useState([
    {
      lng: 76.94006268199648,
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

    setDisasterLoc(
      disasterReport.map((item) => {
        return {
          lng: item.location.coordinates[0],
          lat: item.location.coordinates[1],
        };
      })
    );

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
      center: [disasterLoc[0].lng, disasterLoc[0].lat],
      zoom: 15,
      branding: false,
    });

    const redMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

    //To add the red marker with pulse animation can't add multiple markers!
    // const rMarker = olaMaps
    //   .addMarker({
    //     element: redMarker,
    //     offset: [0, 6],
    //     anchor: "bottom",
    //     // draggable: true,
    //   })
    //   .setLngLat([disasterLoc[0].lng, disasterLoc[0].lat])
    //   .addTo(myMap);

    myMap.on("load", () => {
      //To add multiple disaster markers, marker clustering
      myMap.addSource("disaster-area", {
        type: "geojson",

        data: {
          type: "FeatureCollection",
          features: disasterLoc.map((item) => {
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

      //Adding connector lines between disaster and families
      // myMap.addSource("route", {
      //   type: "geojson",
      //   data: {
      //     type: "Feature",
      //     properties: {},
      //     geometry: {
      //       type: "LineString",
      //       coordinates: [
      //         // [76.94209290280338, 9.850611082222201],
      //         // [77.02679450221746, 9.930319118569855],

      //         ...disasterLoc.map((item) => {
      //           return [item.lng, item.lat];
      //         }),
      //         ...familyLoc.map((item) => {
      //           return [item.lng, item.lat];
      //         }),
      //       ],
      //     },
      //   },
      // });

      // myMap.addLayer({
      //   id: "route",
      //   type: "line",
      //   source: "route",
      //   layout: { "line-join": "round", "line-cap": "round" },
      //   paint: {
      //     "line-color": "red",
      //     "line-width": 4,
      //   },
      // });
    });
  }, [disasterLoc, familyLoc, driverLoc, shelterLoc]);
  return <div id="map" style={{ height: "40rem", width: "70rem" }}></div>;
};

export default AdminDashboard;
