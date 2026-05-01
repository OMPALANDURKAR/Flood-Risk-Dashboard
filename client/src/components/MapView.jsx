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

  const [loading, setLoading] = useState(true);

  const normalize = (str) => str?.trim().toLowerCase();

  // =========================
  // INIT MAP
  // =========================
  useEffect(() => {
    if (mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [22.5, 82],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
    ).addTo(mapInstance.current);

    layerRef.current = L.layerGroup().addTo(mapInstance.current);

    loadGeoJSON();
    loadData();
  }, []);

  // =========================
  // SEARCH
  // =========================
  useEffect(() => {
    if (district && district.length > 2) {
      handleDistrictSearch(district);
    }
  }, [district]);

  const handleDistrictSearch = async (districtName) => {
    await loadData(`?district=${districtName}`);
    highlightDistrict(districtName);
  };

  // =========================
  // COLOR LOGIC
  // =========================
  const getColor = (floods) => {
    if (floods > 5) return "#f43f5e";
    if (floods > 2) return "#f59e0b";
    return "#10b981";
  };

  // =========================
  // LOAD DATA (WITH HOVER EFFECTS)
  // =========================
  const loadData = async (query = "?limit=500") => {
    setLoading(true);

    const res = await getFloodData(query);
    if (!res?.data) {
      setLoading(false);
      return;
    }

    layerRef.current.clearLayers();
    districtDataRef.current = {};

    res.data.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      const d = normalize(p.district);

      if (!districtDataRef.current[d]) {
        districtDataRef.current[d] = {
          rainfall: 0,
          floods: 0,
          history: 0,
          count: 0,
        };
      }

      districtDataRef.current[d].rainfall += p.rainfall_mm || 0;
      districtDataRef.current[d].floods += p.flood_occurred || 0;
      districtDataRef.current[d].history += p.historical_floods || 0;
      districtDataRef.current[d].count++;

      const color = getColor(p.flood_occurred);

      const marker = L.circleMarker([p.latitude, p.longitude], {
        radius: 5,
        color: "#0ea5e9",
        fillColor: color,
        fillOpacity: 0.4,
        weight: 1,
      });

      // 🔥 HOVER EFFECT
      marker
        .on("mouseover", function () {
          this.setStyle({
            radius: 7,
            fillOpacity: 0.6,
          });
        })
        .on("mouseout", function () {
          this.setStyle({
            radius: 5,
            fillOpacity: 0.4,
          });
        });

      marker
        .addTo(layerRef.current)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;font-size:13px;color:#1e293b">
            <b>${p.district || "Unknown"}</b><br/>
            Rainfall: ${p.rainfall_mm ?? "N/A"} mm<br/>
            Flood Events: ${p.flood_occurred}
          </div>
        `);
    });

    setLoading(false);
  };

  // =========================
  // LOAD GEOJSON (WITH HOVER)
  // =========================
  const loadGeoJSON = async () => {
    const res = await fetch("/india_districts.geojson");
    const geojson = await res.json();

    geoLayerRef.current = L.geoJSON(geojson, {
      style: {
        color: "#cbd5f5",
        weight: 1,
        fillOpacity: 0,
      },

      // 🔥 HOVER INTERACTION
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: () => {
            layer.setStyle({
              weight: 2,
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.08,
            });
          },
          mouseout: () => {
            geoLayerRef.current.resetStyle(layer);
          },
        });
      },
    }).addTo(mapInstance.current);
  };

  // =========================
  // HIGHLIGHT DISTRICT
  // =========================
  const highlightDistrict = (districtName) => {
    if (!geoLayerRef.current) return;

    geoLayerRef.current.eachLayer((layer) => {
      geoLayerRef.current.resetStyle(layer);
    });

    geoLayerRef.current.eachLayer((layer) => {
      const name = layer.feature.properties.NAME_2;
      if (!name) return;

      if (normalize(name) === normalize(districtName)) {
        const data = districtDataRef.current[normalize(name)];

        layer.setStyle({
          color: "#2563eb",
          weight: 2,
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
        });

        mapInstance.current.fitBounds(layer.getBounds(), {
          padding: [40, 40],
        });

        if (data && setSelectedDistrictData) {
          setSelectedDistrictData(data);
        }

        if (data) {
          const avgRain = (data.rainfall / data.count).toFixed(2);

          layer.bindPopup(`
            <div style="font-family:Inter,sans-serif;font-size:13px;color:#1e293b">
              <b>${name}</b><br/>
              Avg Rainfall: ${avgRain} mm<br/>
              Floods: ${data.floods}<br/>
              History: ${data.history}
            </div>
          `).openPopup();
        }
      }
    });
  };

  return (
    <div className="
      relative w-full h-full
      rounded-2xl overflow-hidden
      border border-slate-200
      shadow-[0_10px_40px_rgba(0,0,0,0.08)]
      bg-white
    ">

      {/* 🔄 Loading Overlay */}
      {loading && (
        <div className="
          absolute inset-0 z-10
          flex flex-col items-center justify-center gap-3
          bg-white/70 backdrop-blur-sm
        ">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500">
            Loading map data...
          </p>
        </div>
      )}

      {/* 🗺 Map Fade-In */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full"
      >
        <div ref={mapRef} className="w-full h-full" />
      </motion.div>

    </div>
  );
}