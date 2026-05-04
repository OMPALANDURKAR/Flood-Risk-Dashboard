import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { motion } from "framer-motion";
import { getFloodData } from "../api/data";

export default function MapView({ district, setSelectedDistrictData }) {

  console.log("MAP RECEIVED FUNCTION:", setSelectedDistrictData);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);
  const geoLayerRef = useRef(null);
  const selectedLayerRef = useRef(null);
  const pendingSearchRef = useRef(null);
  const cachedPointsRef = useRef([]);

  const [loading, setLoading] = useState(true);

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/district/g, "")
      .replace(/\(.*?\)/g, "")
      .trim();

  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [22.5, 82],
      zoom: 5,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    ).addTo(mapInstance.current);

    layerRef.current = L.layerGroup().addTo(mapInstance.current);

    loadGeoJSON();
    loadData();
  }, []);

  useEffect(() => {
    if (!district) return;

    const trimmed = district.trim();
    if (trimmed.length < 2) return;

    const timer = setTimeout(() => {
      if (geoLayerRef.current) {
        triggerDistrictSelection(trimmed);
      } else {
        pendingSearchRef.current = trimmed;
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [district]);

  const triggerDistrictSelection = (districtName) => {
    if (!geoLayerRef.current) return;

    const input = normalize(districtName);
    let matchedLayer = null;

    geoLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.NAME_2;

      if (normalize(name) === input) {
        matchedLayer = layer;
      }
    });

    if (!matchedLayer) {
      geoLayerRef.current.eachLayer((layer) => {
        const name = layer.feature.properties.NAME_2;

        if (normalize(name).includes(input)) {
          matchedLayer = layer;
        }
      });
    }

    if (matchedLayer) {
      handleDistrictClick(
        matchedLayer,
        matchedLayer.feature.properties.NAME_2
      );
    }
  };

  const renderDistrictMarkers = (districtName) => {
    const d = normalize(districtName);

    layerRef.current.clearLayers();

    cachedPointsRef.current
      .filter((p) => normalize(p.district) === d)
      .forEach((p) => {
        if (!p.latitude || !p.longitude) return;

        L.circleMarker([p.latitude, p.longitude], {
          radius: 5,
          color: "#2DD4BF",
          fillColor: "#2DD4BF",
          fillOpacity: 0.7,
        }).addTo(layerRef.current);
      });
  };

  const handleDistrictClick = (layer, name) => {
    if (!setSelectedDistrictData) return;

    // ✅ FIXED MATCHING
    const data = cachedPointsRef.current.find(
      (p) =>
        p.district &&
        normalize(p.district).includes(normalize(name))
    );

    console.log("MATCHED DATA:", data);

    if (!data) {
      console.log("NO MATCH:", name);
      return;
    }

    const finalData = {
      district: data.district,
      rainfall: Number(data.rainfall_mm || 0),
      waterLevel: Number(data.water_level || 0),
      discharge: Number(data.river_discharge || 0),
      humidity: Number(data.humidity || 0),
      elevation: Number(data.elevation || 0),
      historicalFloods: Number(data.flood_occurred || 0),
    };

    console.log("SETTING DATA:", finalData);

setSelectedDistrictData((prev) => {
  console.log("UPDATING STATE:", finalData);
  return { ...finalData };
});
    if (selectedLayerRef.current) {
      geoLayerRef.current.resetStyle(selectedLayerRef.current);
    }

    layer.setStyle({
      color: "#2563eb",
      weight: 3,
      fillColor: "#3b82f6",
      fillOpacity: 0.2,
    });

    selectedLayerRef.current = layer;

    mapInstance.current.fitBounds(layer.getBounds(), {
      padding: [40, 40],
    });

    renderDistrictMarkers(name);

    layer
      .bindPopup(`
        <div style="font-family: Inter; font-size: 13px;">
          <b>📍 ${name}</b><br/>
          Rainfall: ${finalData.rainfall.toFixed(1)} mm<br/>
          Water Level: ${finalData.waterLevel.toFixed(1)} m<br/>
          Discharge: ${finalData.discharge.toFixed(0)} m³/s<br/>
          Humidity: ${finalData.humidity.toFixed(0)}%<br/>
          Elevation: ${finalData.elevation.toFixed(0)} m<br/>
          Flood Events: ${finalData.historicalFloods}
        </div>
      `)
      .openPopup();
  };

  const loadData = async () => {
    setLoading(true);

    const res = await getFloodData();
    if (!res?.data) return;

    cachedPointsRef.current = res.data;

    setLoading(false);
  };

  const loadGeoJSON = async () => {
    const res = await fetch("/india_districts.geojson");
    const geojson = await res.json();

    geoLayerRef.current = L.geoJSON(geojson, {
      style: {
        color: "#cbd5f5",
        weight: 1,
        fillOpacity: 0,
      },
      onEachFeature: (feature, layer) => {
        const name = feature.properties.NAME_2;

        layer.on({
          mouseover: () => {
            if (layer !== selectedLayerRef.current) {
              layer.setStyle({
                weight: 2,
                color: "#3b82f6",
                fillOpacity: 0.05,
              });
            }
          },
          mouseout: () => {
            if (layer !== selectedLayerRef.current) {
              geoLayerRef.current.resetStyle(layer);
            }
          },
          click: () => handleDistrictClick(layer, name),
        });
      },
    }).addTo(mapInstance.current);

    if (pendingSearchRef.current) {
      triggerDistrictSelection(pendingSearchRef.current);
      pendingSearchRef.current = null;
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 shadow bg-white">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <motion.div className="w-full h-full">
        <div ref={mapRef} className="w-full h-full" />
      </motion.div>
    </div>
  );
}