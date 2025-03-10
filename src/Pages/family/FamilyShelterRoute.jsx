import { useState, useEffect } from "react";

import { OlaMaps } from "../../../OlaMapsWebSDKNew";
import polyline from "@mapbox/polyline";

import axios from "axios";

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

const FamilyShelterRoute = ({ destinaitonLoc }) => {
  //   const [destinaitonLoc, setDestinaitonLoc] = useState({
  //     lng: 76.94006268199648,
  //     lat: 9.851076591262078,
  //   });

  // Map dependencies
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
  const [shelterLoc, setShelterLoc] = useState([
    {
      lng: 76.94006268199648,
      lat: 9.851076591262078,
    },
  ]);
  const [blockLoc, setBlockLoc] = useState([
    {
      lng: 76.94006268199648,
      lat: 9.851076591262078,
    },
  ]);

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
        setFamilyLoc(
          response.data.families.map((item) => {
            return {
              lng: item.address.location.coordinates[0],
              lat: item.address.location.coordinates[1],
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });

    axios
      .get(`${BASE_URL}/driver/get-all-shelters`)
      .then((response) => {
        setShelterLoc(
          response.data.Shelters.map((item) => {
            return {
              lng: item.address.location.coordinates[0],
              lat: item.address.location.coordinates[1],
            };
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });

    axios.get(`${BASE_URL}/volunteer/get-all-road-blocks`).then((response) => {
      setBlockLoc(
        response.data.roadBlocks.map((item) => {
          return {
            lng: item.location.coordinates[0],
            lat: item.location.coordinates[1],
          };
        })
      );
    });
  }, []);

  // Creating an instance for olaMaps
  useEffect(() => {
    setOlaMaps(
      new OlaMaps({
        apiKey: MAP_API_KEY,
      })
    );
  }, []);

  // Initializing the global map when the olaMaps instance is ready
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

  // Adding draggable driver marker
  useEffect(() => {
    if (globalMap) {
      const dMarker = createCustomMarker("bg-red-600", "bg-red-400/50");

      const familyMarker = olaMaps
        .addMarker({
          element: dMarker,
          offset: [0, 6],
          anchor: "bottom",
          draggable: true,
        })
        .setLngLat([driverLoc.lng, driverLoc.lat])
        .addTo(globalMap);

      familyMarker.on("dragend", () => {
        const lngLat = familyMarker.getLngLat();
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

  // Updating the driver location in DB and getting the route on driver location change
  useEffect(() => {
    axios
      .post(
        `https://api.olamaps.io/routing/v1/directions?origin=${driverLoc.lat},${driverLoc.lng}&destination=${destinaitonLoc.lat},${destinaitonLoc.lng}&api_key=${MAP_API_KEY}`
      )
      .then((response) => {
        const encodedString = response.data.routes[0].overview_polyline;
        const coords = polyline.decode(encodedString);
        setRouteCoords(
          coords.map((item) => {
            return {
              lng: item[1],
              lat: item[0],
            };
          })
        );
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

  // Adding the markers and routes in the global map
  useEffect(() => {
    if (olaMaps && globalMap && routeCoords) {
      globalMap.on("load", () => {
        // To add multiple disaster markers, marker clustering
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

        // Color in wider view
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

        // Color in closer view
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

        // To add multiple families markers, marker clustering
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

        // Color in wider view
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

        // Color in closer view
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

        // To add multiple shelters markers, marker clustering
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

        // Color in wider view
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

        // Color in closer view
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

        // To add multiple road blocks markers, marker clustering
        globalMap.addSource("road-blocks", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: blockLoc.map((item) => {
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

        // Color in wider view
        globalMap.addLayer({
          id: "road-blocks-clusters",
          type: "circle",
          source: "road-blocks",
          filter: ["has", "point_count"],

          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "orange",
              2,
              "orange",
            ],
            "circle-radius": ["step", ["get", "point_count"], 20, 2, 30, 4, 40],
          },
        });

        // Color in closer view
        globalMap.addLayer({
          id: "road-blocks-unclustered-point",
          type: "circle",
          source: "road-blocks",
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": "orange",
            "circle-radius": 20,
            "circle-stroke-width": 1,
            "circle-stroke-color": "orange",
          },
        });

        globalMap.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: routeCoords.map((item) => {
                return [item.lng, item.lat];
              }),
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
              coordinates: routeCoords.map((item) => {
                return [item.lng, item.lat];
              }),
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
              coordinates: routeCoords.map((item) => {
                return [item.lng, item.lat];
              }),
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
    blockLoc,
    shelterLoc,
    olaMaps,
    globalMap,
    routeCoords,
  ]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] text-gray-100">
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="bg-[#1e2538] rounded-lg shadow-lg p-4 sm:p-6">
          <div
            id="map"
            className="h-150 sm:h-100 md:h-[30rem] lg:h-[40rem] w-full"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FamilyShelterRoute;
