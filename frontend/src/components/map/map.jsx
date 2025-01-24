import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic29oYW0xMiIsImEiOiJjbG5mMThidXcwa2o4Mml0Y3IzMHh0ZzM1In0.NKrFUG12iisWBbf-TVp34g";

function Map() {
  const [markers, setMarkers] = useState([]);
  const [line, setLine] = useState(null);
  const [mapContainer, setMapContainer] = useState(null);

  useEffect(() => {
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

    // Add directions control
    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/driving",
      alternatives: true,
      geometries: "geojson",
    });

    map.addControl(directions, "top-left");

    // Cleanup map when component is unmounted
    return () => {
      markers.forEach((marker) => marker.remove());
      if (map) {
        map.remove();
      }
    };
  }, [markers, line, mapContainer]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <style>{`
        .mapBox {
          width: 80%;
          height: 80vh;
          margin: 1rem;
          border-radius: 1rem;
        }

        @media (max-width: 768px) {
          .mapBox {
            width: 90%;
            height: 30vh;
            border-radius: 1rem;
          }
        }
      `}</style>
      <div ref={setMapContainer} className="mapBox" />
    </div>
  );
}

export default Map;
