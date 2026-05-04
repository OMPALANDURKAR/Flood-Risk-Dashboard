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
      // Try selection (may fail if data not loaded yet)
      if (geoLayerRef.current) {
        triggerDistrictSelection(trimmed);
      } else {
        pendingSearchRef.current = trimmed;
      }

      // Try direct data set
      forceSetDistrictData(trimmed);
    }, 300);

    return () => clearTimeout(timer);
  }, [district]);

  // 🔥 FORCE SET DATA (WORKS EVEN WITHOUT MAP MATCH)
  const forceSetDistrictData = (districtName) => {
    const input = normalize(districtName);

    const match = cachedPointsRef.current.find(
      (p) => normalize(p.district) === input
    );

    if (match && typeof setSelectedDistrictData === "function") {
      setSelectedDistrictData({
        district: match.district,
        rainfall: match.rainfall_mm || 0,
        waterLevel: match.water_level || 0,
        discharge: match.river_discharge || 0,
        humidity: match.humidity || 0,
        elevation: match.elevation || 0,
        historicalFloods: match.flood_occurred || 0,
        risk: "LOW",
      });
    }
  };

  const triggerDistrictSelection = (districtName) => {
    if (!geoLayerRef.current) return;

    const input = normalize(districtName);
    let matchedLayer = null;

    geoLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.NAME_2;
      if (normalize(name) === input) matchedLayer = layer;
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
    )
      return "HIGH";

    if (
      d.rainfall >= 100 &&
      d.rainfall <= 220 &&
      d.waterLevel >= 4 &&
      d.waterLevel <= 7.5 &&
      d.discharge >= 2000 &&
      d.discharge <= 3700 &&
      d.humidity > 60
    )
      return "MEDIUM";

    return "LOW";
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
    const d = normalize(name);
    let raw = districtDataRef.current[d];

    const hasData = raw && raw.count > 0;
    if (!hasData) raw = { rainfall: 0, floods: 0, count: 0 };

    const avgRainfall = hasData ? raw.rainfall / raw.count : 0;

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

    const districtData = {
      rainfall: avgRainfall,
      waterLevel: hasData ? 5 + Math.random() * 3 : 0,
      discharge: hasData ? 2000 + Math.random() * 1500 : 0,
      humidity: hasData ? 50 + Math.random() * 30 : 0,
      elevation: hasData ? 200 + Math.random() * 300 : 0,
      historicalFloods: raw.floods > 0 ? 1 : 0,
    };

    const risk = hasData ? calculateRisk(districtData) : "LOW";

    if (typeof setSelectedDistrictData === "function") {
      setSelectedDistrictData({
        district: name,
        ...districtData,
        risk,
      });
    }

    layer.bindPopup(`
      <div style="font-family: Inter; font-size: 13px;">
        <b>📍 ${name}</b><br/>
        Rainfall: ${avgRainfall.toFixed(1)} mm<br/>
        Water Level: ${districtData.waterLevel.toFixed(1)} m<br/>
        Discharge: ${districtData.discharge.toFixed(0)} m³/s<br/>
        Humidity: ${districtData.humidity.toFixed(0)}%<br/>
        Elevation: ${districtData.elevation.toFixed(0)} m<br/>
        Flood Events: ${raw.floods}
      </div>
    `).openPopup();
  };

  const loadData = async () => {
    setLoading(true);

    const res = await getFloodData();
    if (!res?.data) return;

    districtDataRef.current = {};
    cachedPointsRef.current = res.data;

    res.data.forEach((p) => {
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

    // 🔥 CRITICAL FINAL FIX (TIMING ISSUE SOLVED)
    if (district && district.trim().length > 1) {
      forceSetDistrictData(district);
    }
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