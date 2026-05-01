import { useState, useEffect } from "react";
import { predictFlood } from "../api/predict";
import { motion } from "framer-motion";

export default function Sidebar({ setDistrict, selectedDistrictData }) {
  const [search, setSearch] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length > 2) {
      setDistrict(value.trim());
    }
  };

  useEffect(() => {
    if (!selectedDistrictData || selectedDistrictData.count === 0) {
      setPrediction(null);
      return;
    }

    const runPrediction = async () => {
      try {
        setLoading(true);

        const avgRainfall =
          selectedDistrictData.rainfall / selectedDistrictData.count;

        const input = {
          rainfall: Number(avgRainfall.toFixed(2)),
          riverLevel: 6,
          soilMoisture: 50,
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
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
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
      </motion.div>

      {/* ===== DIVIDER ===== */}
      <div className="border-t border-slate-200"></div>

      {/* ===== PREDICTION ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
          AI Prediction
        </p>

        {/* CARD */}
        <motion.div
          whileHover={{ y: -3 }}
          className="
            bg-white/90 border border-slate-100
            rounded-xl p-5
            shadow-[0_6px_18px_rgba(0,0,0,0.06)]
            transition-all duration-300
            hover:border-blue-200
            hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]
          "
        >

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
            <div className="space-y-2">
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

              <p className="text-sm text-slate-500">
                Probability:{" "}
                <span className="font-semibold text-slate-800">
                  {prediction.probability}
                </span>
              </p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !prediction && (
            <p className="text-sm text-slate-400">
              Select a district to view prediction
            </p>
          )}
        </motion.div>
      </motion.div>

    </motion.aside>
  );
}