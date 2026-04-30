import { useEffect, useRef } from "react";
import L from "leaflet";
import { getFloodData } from "../api/data";

export default function MapView({ district }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);
  const geoLayerRef = useRef(null);

  // INIT MAP
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current).setView([22.5, 82], 5);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    ).addTo(mapInstance.current);

    layerRef.current = L.layerGroup().addTo(mapInstance.current);

    loadGeoJSON(); // load districts
    loadData();
  }, []);

  // SEARCH TRIGGER
  useEffect(() => {
    if (district && district.length > 2) {
      loadData(`?district=${district}`);
      highlightDistrict(district);
    }
  }, [district]);

  // LOAD MARKERS
  const loadData = async (query = "?limit=500") => {
    const res = await getFloodData(query);

    if (!res?.data) return;

    layerRef.current.clearLayers();

    res.data.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      L.circleMarker([p.latitude, p.longitude], {
        radius: 5,
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.8,
      })
        .addTo(layerRef.current)
        .bindPopup(`
          <b>${p.district}</b><br/>
          Rainfall: ${p.rainfall_mm}<br/>
          Flood: ${p.flood_occurred}<br/>
          History: ${p.historical_floods}
        `);
    });
  };

  // LOAD GEOJSON
  const loadGeoJSON = async () => {
    const res = await fetch("/india_districts.geojson");
    const geojson = await res.json();

    geoLayerRef.current = L.geoJSON(geojson, {
      style: {
        color: "#334155",
        weight: 1,
        fillOpacity: 0,
      },
    }).addTo(mapInstance.current);
  };

  // 🔥 HIGHLIGHT DISTRICT
  const highlightDistrict = (districtName) => {
    if (!geoLayerRef.current) return;

    geoLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.NAME_2;

      if (
        name &&
        name.toLowerCase().includes(districtName.toLowerCase())
      ) {
        // RESET STYLE FIRST
        geoLayerRef.current.resetStyle(layer);

        // APPLY GLOW STYLE
        layer.setStyle({
          color: "#22c55e",
          weight: 3,
          fillColor: "#22c55e",
          fillOpacity: 0.25,
        });

        // ZOOM
        mapInstance.current.fitBounds(layer.getBounds());

        // POPUP
        layer.bindPopup(`<b>${name}</b>`).openPopup();
      }
    });
  };

  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
  );
}