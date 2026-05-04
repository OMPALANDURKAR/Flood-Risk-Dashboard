import { useState, useEffect } from "react";
import { predictFlood } from "../api/predict";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar({ setDistrict, selectedDistrictData }) {
  const [search, setSearch] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ SAME NORMALIZER (CRITICAL)
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/district/g, "")
      .replace(/\(.*?\)/g, "")
      .replace(/[^a-z]/g, "")
      .trim();

  // =========================
  // 🔍 AUTOCOMPLETE FROM MAP
  // =========================
  useEffect(() => {
    const val = normalize(search);

    if (!val) {
      setSuggestions([]);
      return;
    }

    const allDistricts = window.districtList || [];

    const filtered = allDistricts
      .filter((d) => normalize(d).includes(val))
      .slice(0, 6);

    setSuggestions(filtered);
  }, [search]);

  // =========================
  // SEARCH INPUT
  // =========================
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // =========================
  // 🔥 DEBOUNCED SEARCH
  // =========================
  useEffect(() => {
    const trimmed = search.trim();

    if (trimmed.length < 3) {
      setDistrict("");
      return;
    }

    const timer = setTimeout(() => {
      setDistrict(normalize(trimmed));
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // =========================
  // SELECT FROM DROPDOWN
  // =========================
  const selectDistrict = (name) => {
    setSearch(name);
    setDistrict(normalize(name));
    setSuggestions([]);
  };

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
      } catch {
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
      <div className="space-y-3 relative">

        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
            Search
          </p>
          <h2 className="text-lg font-semibold text-slate-800">
            District Finder
          </h2>
        </div>

        <div className="relative">
          <input
            value={search}
            onChange={handleSearch}
            placeholder="Search district..."
            className="
              w-full px-4 py-2.5 rounded-xl
              bg-white/80
              border border-slate-200
              text-slate-800 placeholder-slate-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-500/20
              focus:border-blue-500
              shadow-sm
              transition-all duration-200
            "
          />

          <span className="absolute right-3 top-2.5 text-slate-400">
            🔍
          </span>
        </div>

        {/* ===== AUTOCOMPLETE ===== */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="
                absolute top-full left-0 right-0 mt-2
                bg-white border border-slate-200
                rounded-xl shadow-lg z-50 overflow-hidden
              "
            >
              {suggestions.map((item, i) => (
                <div
                  key={i}
                  onClick={() => selectDistrict(item)}
                  className="
                    px-4 py-2 text-sm cursor-pointer
                    hover:bg-blue-50 hover:text-blue-600
                    transition
                  "
                >
                  {item}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

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

          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-8 w-1/2 bg-slate-200 rounded"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded"></div>
            </div>
          )}

          {!loading && prediction && (
            <div className="space-y-3">
              <h2
                className={`text-5xl font-bold ${
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