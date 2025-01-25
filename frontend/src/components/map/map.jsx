import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g";

function Map() {
  const emissions = {
    Car: 0.12, // kg CO2 per km
    Bus: 0.08,
    MotorCycle: 0.05,
    ElectricCar: 0.04,
  };

  const vehicleEmojis = {
    MotorCycle: "🏍️",
    Car: "🚗",
    Bus: "🚌",
    ElectricCar: "🚙",
  };

  const vehicle = ["MotorCycle", "Car", "Bus", "ElectricCar"];
  const [markers, setMarkers] = useState([]);
  const [line, setLine] = useState(null);
  const [mapContainer, setMapContainer] = useState(null);
  const [routeDetails, setRouteDetails] = useState([]);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState([]);
  const [selectedvehicleDetails, setSelectedVehicleDetails] = useState(
    vehicle[0],
  );

  useEffect(() => {
    console.log(mapContainer, "=================map");
    if (!mapContainer) return;

    const map = new mapboxgl.Map({
      style: "mapbox://styles/mapbox/streets-v12",
      center: [72.83627602340445, 18.959732630284932],
      zoom: 10.5,
      pitch: 45,
      bearing: -15.6,
      container: mapContainer,
      antialias: true,
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      alternatives: true,
      geometries: "geojson",
    });

    map.addControl(directions, "top-left");

    directions.on("route", (e) => {
      if (e.route && e.route.length > 0) {
        console.log(e.route, "====================croute");
        setRouteDetails(
          e.route.map((route, index) => ({ ...route, routeIndex: index })),
        );
        setSelectedRouteDetails({ ...e.route[0], routeIndex: 0 });
      }
    });

    directions.on("clear", () => {
      setRouteDetails([]);
    });

    return () => {
      markers.forEach((marker) => marker.remove());
      if (map) {
        map.remove();
      }
    };
  }, [markers, line, mapContainer]);

  return (
    <div className="flex flex-row">
      <style>{`
        .mapBox {
          width: 65%;
          height: 80vh;
          margin: 1rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .emissions-panel {
          width: 30%;
          margin: 1rem;
          padding: 2rem;
          background-color: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          height: fit-content;
          position: sticky;
          top: 1rem;
        }

        .route-option {
          padding: 1rem;
          margin: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e5e5;
        }

        .route-option:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
        }

        .vehicle-option {
          padding: 1rem;
          margin: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e5e5;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .vehicle-option:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
        }

        .info-panel {
          margin-top: 1rem;
          padding: 1.5rem;
          border-radius: 1rem;
          background-color: #f8f9fa;
          border: 1px solid #e5e5e5;
          transition: all 0.2s ease;
        }

        .info-panel:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        h1 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .mapBox {
            width: 100%;
            height: 40vh;
            margin: 0.5rem;
          }

          .emissions-panel {
            width: 100%;
            margin: 0.5rem;
            padding: 1rem;
          }
        }
      `}</style>
      <div ref={setMapContainer} className="mapBox" />
      <div className="emissions-panel">
        <div>
          {routeDetails && routeDetails.length > 0 && (
            <>
              <h1>Route Option</h1>
              <div className="grid grid-cols-3 gap-4">
                {routeDetails.map((route, index) => (
                  <div
                    key={index}
                    className="route-option"
                    style={{
                      backgroundColor:
                        selectedRouteDetails.routeIndex === route.routeIndex
                          ? "#e5e5e5"
                          : "transparent",
                    }}
                    onClick={() => {
                      setSelectedRouteDetails(route);
                    }}
                  >
                    Route {index + 1}
                  </div>
                ))}
              </div>
            </>
          )}
          {routeDetails && routeDetails.length > 0 && (
            <>
              <h1>Vehicle Option</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {vehicle.map((value, index) => (
                  <div
                    key={index}
                    className="vehicle-option"
                    style={{
                      backgroundColor:
                        selectedvehicleDetails === value
                          ? "#e5e5e5"
                          : "transparent",
                    }}
                    value={value}
                    onClick={() => {
                      setSelectedVehicleDetails(value);
                    }}
                  >
                    {vehicleEmojis[value]} {value}
                  </div>
                ))}
              </div>
            </>
          )}
          {routeDetails && routeDetails.length > 0 && (
            <div className="grid grid-rows-2 gap-4 mt-4">
              <div className="info-panel">
                <h1 className="font-bold mb-2 text-lg">Carbon Emissions</h1>
                <p className="text-lg">
                  {(
                    selectedRouteDetails.distance *
                    emissions[selectedvehicleDetails]
                  ).toFixed(2)}{" "}
                  kg CO2
                </p>
              </div>
              <div className="info-panel">
                <h1 className="font-bold mb-2">Distance Travel</h1>
                <p className="text-lg">
                  {(selectedRouteDetails.distance / 1000).toFixed(2)} km
                </p>
              </div>
            </div>
          )}
          {routeDetails && routeDetails.length === 0 && (
            <div className="text-center p-4">Please select the route</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Map;
