import { useState, useEffect } from "react";
import { predictFlood } from "../api/predict";
import { motion } from "framer-motion";

export default function Sidebar({ setDistrict, selectedDistrictData }) {
  const [search, setSearch] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 SAME NORMALIZER AS MAPVIEW (CRITICAL)
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/district/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z]/g, "")
      .trim();

  // =========================
  // SEARCH INPUT
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // =========================
  // 🔥 DEBOUNCED + CLEAN SEARCH (FIXED)
  // =========================
  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 3) {
      setDistrict("");
      return;
    }

    const timer = setTimeout(() => {
      const clean = normalize(trimmed);
      setDistrict(clean); // 🔥 SEND CLEAN VALUE
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // PREDICTION
  // =========================
  useEffect(() => {
    if (!selectedDistrictData) {
      setPrediction(null);
      return;
    }

    const runPrediction = async () => {
      try {
        setLoading(true);

        const input = {
          rainfall: Number(selectedDistrictData.rainfall?.toFixed(2)),
          waterLevel: selectedDistrictData.waterLevel,
          discharge: selectedDistrictData.discharge,
          humidity: selectedDistrictData.humidity,
          elevation: selectedDistrictData.elevation,
          historicalFloods: selectedDistrictData.historicalFloods,
        };

        const res = await predictFlood(input);
        setPrediction(res?.success ? res : null);
      } catch (err) {
        console.error("Prediction error:", err);
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    runPrediction();
  }, [selectedDistrictData]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="
        h-full flex flex-col gap-8 p-6
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        rounded-2xl
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
      "
    >

      {/* ===== SEARCH ===== */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
            Search
          </p>
          <h2 className="text-lg font-semibold text-slate-800">
            District Finder
          </h2>
        </div>

        <input
          value={search}
          onChange={handleSearch}
          placeholder="Type district name..."
          className="
            w-full px-3 py-2 rounded-lg
            bg-slate-100/60 focus:bg-white
            border border-slate-200
            text-slate-800 placeholder-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/20
            focus:border-blue-500
            focus:shadow-[0_0_0_3px_rgba(37,99,235,0.08)]
            transition-all duration-200
          "
        />
      </div>

      <div className="border-t border-slate-200"></div>

      {/* ===== PREDICTION ===== */}
      <div className="space-y-3">
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
          AI Prediction
        </p>

        <div className="
          bg-white/90 border border-slate-100
          rounded-xl p-5
          shadow-[0_6px_18px_rgba(0,0,0,0.06)]
        ">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-slate-500">
              Flood Risk
            </p>

            {loading && (
              <span className="text-xs text-blue-500 animate-pulse">
                analyzing...
              </span>
            )}
          </div>

          {/* LOADING */}
          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            </div>
          )}

          {/* RESULT */}
          {!loading && prediction && (
            <div className="space-y-3">
              <h2
                className={`text-5xl font-bold tracking-tight ${
                  prediction.risk === "HIGH"
                    ? "text-rose-600"
                    : prediction.risk === "MEDIUM"
                    ? "text-amber-500"
                    : "text-emerald-600"
                }`}
              >
                {prediction.risk}
              </h2>

              {prediction.factors && (
                <div className="space-y-1">
                  {prediction.factors.map((f, i) => (
                    <p key={i} className="text-xs text-slate-500">
                      • {f}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EMPTY */}
          {!loading && !prediction && (
            <div className="text-sm text-slate-400 text-center py-6">
              <p className="mb-1">📍 No district selected</p>
              <p className="text-xs">Click on map to analyze flood risk</p>
            </div>
          )}

        </div>
      </div>

    </motion.aside>
  );
}