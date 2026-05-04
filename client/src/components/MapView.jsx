import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { motion } from "framer-motion";
import { getFloodData } from "../api/data";

export default function MapView({ district, setSelectedDistrictData }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const layerRef = useRef(null);
  const geoLayerRef = useRef(null);
  const districtDataRef = useRef({});
  const selectedLayerRef = useRef(null);
  const pendingSearchRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/district/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z]/g, "")
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
    if (trimmed.length < 3) return;

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
        const geoName = normalize(name);

        if (geoName.includes(input) || input.includes(geoName)) {
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

  const calculateRisk = (d) => {
    if (
      d.rainfall > 220 &&
      d.waterLevel > 7.5 &&
      d.discharge > 3700 &&
      (d.historicalFloods === 1 || d.elevation < 2500)
    ) return "HIGH";

    if (
      d.rainfall >= 100 &&
      d.rainfall <= 220 &&
      d.waterLevel >= 4 &&
      d.waterLevel <= 7.5 &&
      d.discharge >= 2000 &&
      d.discharge <= 3700 &&
      d.humidity > 60
    ) return "MEDIUM";

    return "LOW";
  };

  const handleDistrictClick = (layer, name) => {
    const d = normalize(name);
    let raw = districtDataRef.current[d];

    // ✅ FIXED: CHECK DATA PROPERLY
    const hasData = raw && raw.count > 0;

    if (!hasData) {
      raw = {
        rainfall: null,
        floods: 0,
        count: 0,
      };
    }

    const avgRainfall = hasData
      ? raw.rainfall / raw.count
      : null;

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

    const districtData = {
      rainfall: avgRainfall || 0,
      waterLevel: hasData ? 5 + Math.random() * 3 : null,
      discharge: hasData ? 2000 + Math.random() * 1500 : null,
      humidity: hasData ? 50 + Math.random() * 30 : null,
      elevation: hasData ? 200 + Math.random() * 300 : null,
      historicalFloods: raw.floods > 0 ? 1 : 0,
    };

    const risk = hasData ? calculateRisk(districtData) : "N/A";

    setSelectedDistrictData?.({
      district: name,
      ...districtData,
      risk,
    });

    // ✅ FIXED POPUP (NO MORE 0 VALUES)
    layer.bindPopup(`
      <div style="font-family:Inter,sans-serif;font-size:13px;color:#1e293b">
        <b>${name}</b><br/>
        🌧 Rainfall: ${avgRainfall ? avgRainfall.toFixed(1) + " mm" : "No data"}<br/>
        🌊 Water Level: ${districtData.waterLevel ? districtData.waterLevel.toFixed(1) + " m" : "No data"}<br/>
        🚰 Discharge: ${districtData.discharge ? districtData.discharge.toFixed(0) + " m³/s" : "No data"}<br/>
        💧 Humidity: ${districtData.humidity ? districtData.humidity.toFixed(0) + "%" : "No data"}<br/>
        ⛰ Elevation: ${districtData.elevation ? districtData.elevation.toFixed(0) + " m" : "No data"}<br/>
        📊 Flood Events: ${raw.floods}<br/><br/>
        <b style="color:${
          risk === "HIGH"
            ? "#ef4444"
            : risk === "MEDIUM"
            ? "#f59e0b"
            : risk === "LOW"
            ? "#10b981"
            : "#64748b"
        }">Risk: ${risk}</b>
      </div>
    `).openPopup();
  };

  const loadData = async () => {
    setLoading(true);

    const res = await getFloodData("?limit=500");
    if (!res?.data) return;

    layerRef.current.clearLayers();
    districtDataRef.current = {};

    res.data.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const d = normalize(p.district);

      if (!districtDataRef.current[d]) {
        districtDataRef.current[d] = {
          rainfall: 0,
          floods: 0,
          count: 0,
        };
      }

      districtDataRef.current[d].rainfall += p.rainfall_mm || 0;
      districtDataRef.current[d].floods += p.flood_occurred || 0;
      districtDataRef.current[d].count++;
    });

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

    // AUTOCOMPLETE
    window.districtList = [];
    geoLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.NAME_2;
      if (name) window.districtList.push(name);
    });

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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full"
      >
        <div ref={mapRef} className="w-full h-full" />
      </motion.div>
    </div>
  );
}