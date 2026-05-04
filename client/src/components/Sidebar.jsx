import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getFloodData } from "../api/data";

export default function Sidebar({ setDistrict, selectedDistrictData }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [districtList, setDistrictList] = useState([]);

  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/district/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z]/g, "")
      .trim();

  // =========================
  // FETCH DISTRICTS FROM BACKEND
  // =========================
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await getFloodData();
        const data = res.data || [];

        const unique = [
          ...new Set(data.map((item) => item.district).filter(Boolean)),
        ];

        setDistrictList(unique);
      } catch (err) {
        console.error("Failed to fetch districts", err);
      }
    };

    fetchDistricts();
  }, []);

  // =========================
  // AUTOCOMPLETE
  // =========================
  useEffect(() => {
    const val = normalize(search);

    if (!val) {
      setSuggestions([]);
      return;
    }

    const filtered = districtList
      .filter((d) => normalize(d).includes(val))
      .slice(0, 6);

    setSuggestions(filtered);
  }, [search, districtList]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 2) {
      setDistrict("");
      return;
    }

    const timer = setTimeout(() => {
      setDistrict((trimmed));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const selectDistrict = (name) => {
    setSearch(name);
    setDistrict((name));
    setSuggestions([]);
  };

  // =========================
  // RISK %
  // =========================
  const getRiskMeta = (data) => {
    const { rainfall, waterLevel, discharge } = data;

    const rainScore = Math.min((rainfall / 300) * 100, 100);
    const waterScore = Math.min((waterLevel / 10) * 100, 100);
    const dischargeScore = Math.min((discharge / 5000) * 100, 100);

    const avgScore = (rainScore + waterScore + dischargeScore) / 3;

    let label = "LOW";
    let color = "#10b981";

    if (avgScore > 70) {
      label = "HIGH";
      color = "#ef4444";
    } else if (avgScore > 40) {
      label = "MEDIUM";
      color = "#f59e0b";
    }

    return {
      percent: Math.round(avgScore),
      color,
      label,
    };
  };

  // =========================
  // PRIMARY DRIVER
  // =========================
  const getPrimaryDriver = (data) => {
    const { rainfall, waterLevel, discharge } = data;

    const scores = [
      { key: "Rainfall", value: rainfall },
      { key: "Water Level", value: waterLevel * 30 },
      { key: "Discharge", value: discharge / 50 },
    ];

    scores.sort((a, b) => b.value - a.value);
    return scores[0].key;
  };

  // =========================
  // INSIGHTS
  // =========================
  const generateInsights = (data) => {
    const insights = [];
    const { rainfall, waterLevel, discharge, humidity, elevation, historicalFloods } = data;

    if (rainfall > 220) insights.push("🌧 Heavy rainfall detected");
    else if (rainfall >= 100) insights.push("🌦 Moderate rainfall");

    if (waterLevel > 7.5) insights.push("🌊 Critical water level");
    else if (waterLevel >= 4) insights.push("🌊 Elevated water level");

    if (discharge > 3700) insights.push("🚰 Extreme discharge");
    else if (discharge >= 2000) insights.push("🚰 High discharge");

    if (historicalFloods === 1) insights.push("📊 Flood-prone area");

    if (humidity > 60) insights.push("💧 High soil saturation");

    if (elevation < 300) insights.push("⛰ Low elevation risk");

    if (insights.length === 0) insights.push("✅ Stable conditions");

    return insights;
  };

  // =========================
  // INFO PANEL
  // =========================
  const InfoPanel = () => (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1">
          🌊 Flood Risk Overview
        </h3>
        <p className="text-xs text-slate-600">
          Risk is calculated using environmental and hydrological factors.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <InfoItem title="Rainfall" desc="Heavy rain → runoff" />
        <InfoItem title="Water Level" desc="River overflow risk" />
        <InfoItem title="Discharge" desc="Flow intensity" />
        <InfoItem title="Humidity" desc="Soil saturation" />
        <InfoItem title="Elevation" desc="Low land floods faster" />
        <InfoItem title="History" desc="Past flood patterns" />
      </div>

      <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600">
        💡 Search a district to view flood analysis
      </div>
    </div>
  );

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col gap-6 p-6 bg-white/80 border rounded-2xl"
    >
      {/* SEARCH */}
      <div className="space-y-3 relative">
        <h2 className="text-lg font-semibold">District Finder</h2>

        <input
          value={search}
          onChange={handleSearch}
          placeholder="Search district..."
          className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-200"
        />

        {/* DROPDOWN */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 bg-white border shadow-xl rounded-xl z-50 overflow-hidden"
            >
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => selectDistrict(item)}
                  className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-50"
                >
                  {item}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONTENT */}
      <div className="bg-white p-5 rounded-xl shadow space-y-4 flex-1 overflow-y-auto">
        {!selectedDistrictData ? (
          <InfoPanel />
        ) : (
          <>
            <div className="font-semibold text-sm">
              📍 {selectedDistrictData.district}
            </div>

            {(() => {
              const { percent, color, label } =
                getRiskMeta(selectedDistrictData);

              return (
                <>
                  <div className="w-full bg-slate-200 h-2 rounded">
                    <div
                      className="h-2 rounded"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  <div style={{ color }} className="text-xs text-right">
                    {label} ({percent}%)
                  </div>
                </>
              );
            })()}

            <div className="grid grid-cols-2 gap-3">
              <Stat label="Rainfall" value={`${selectedDistrictData.rainfall.toFixed(1)} mm`} />
              <Stat label="Water Level" value={`${selectedDistrictData.waterLevel.toFixed(1)} m`} />
              <Stat label="Discharge" value={selectedDistrictData.discharge.toFixed(0)} />
              <Stat label="Flood Events" value={selectedDistrictData.historicalFloods} />
            </div>

            <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs">
              🧠 Driver: {getPrimaryDriver(selectedDistrictData)}
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-1">Why this risk?</p>
              {generateInsights(selectedDistrictData).map((item, i) => (
                <p key={i} className="text-xs text-slate-600">
                  • {item}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
}

// ================= COMPONENTS =================
function Stat({ label, value }) {
  return (
    <div className="bg-slate-100 rounded-lg p-3 text-xs">
      <div className="text-slate-500">{label}</div>
      <div className="font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function InfoItem({ title, desc }) {
  return (
    <div className="bg-slate-100 hover:bg-slate-200 transition rounded-lg p-3">
      <div className="font-semibold text-slate-800 text-xs">{title}</div>
      <div className="text-slate-500 text-xs">{desc}</div>
    </div>
  );
}