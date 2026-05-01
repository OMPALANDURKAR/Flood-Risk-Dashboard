import { useEffect, useState } from "react";
import { getAnalytics } from "../api/data";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

ChartJS.defaults.color = "#64748b";

export default function AnalyticsPanel() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setData(res.data || {});
    } catch (err) {
      console.error("Analytics fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const districts = Object.keys(data);

  let total = 0;
  let floods = 0;
  let high = 0;
  let medium = 0;
  let low = 0;

  districts.forEach((d) => {
    const item = data[d] || {};
    total += item.total || 0;
    floods += item.floods || 0;

    if (item.floods > 5) high++;
    else if (item.floods > 2) medium++;
    else low++;
  });

  // =========================
  // CHART DATA
  // =========================
  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ["#f43f5e", "#f59e0b", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const topDistricts = Object.entries(data)
    .sort((a, b) => (b[1]?.floods || 0) - (a[1]?.floods || 0))
    .slice(0, 5);

  const barData = {
    labels: topDistricts.map((d) => d[0]),
    datasets: [
      {
        label: "Flood Events",
        data: topDistricts.map((d) => d[1]?.floods || 0),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    plugins: {
      legend: {
        labels: { color: "#64748b" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { color: "#f1f5f9" },
      },
    },
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="
        h-full flex flex-col gap-7 p-6
        bg-white/80 backdrop-blur-xl
        border border-slate-200
        rounded-2xl
        shadow-[0_10px_30px_rgba(0,0,0,0.05)]
      "
    >

      {/* ===== HEADER ===== */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
          Insights
        </p>
        <h2 className="text-lg font-semibold text-slate-800">
          Analytics Dashboard
        </h2>
      </div>

      {/* ===== LOADING ===== */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="h-28 bg-slate-200 rounded"></div>
          <div className="h-28 bg-slate-200 rounded"></div>
        </div>
      ) : (
        <>
          {/* ===== SUMMARY ===== */}
          <div className="grid grid-cols-2 gap-5">

            {[
              { label: "Total Records", value: total, color: "text-blue-600" },
              { label: "Flood Events", value: floods, color: "text-rose-600" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -3 }}
                className="
                  bg-white/90 border border-slate-100
                  rounded-xl p-5
                  shadow-[0_6px_18px_rgba(0,0,0,0.06)]
                  hover:border-blue-200
                  hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]
                  transition-all duration-300
                "
              >
                <p className="text-xs text-slate-400 mb-1">
                  {card.label}
                </p>
                <h3 className={`text-3xl font-bold ${card.color}`}>
                  {card.value}
                </h3>
              </motion.div>
            ))}

          </div>

          {/* ===== DONUT ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              bg-white/90 border border-slate-100
              rounded-xl p-5
              shadow-[0_6px_18px_rgba(0,0,0,0.06)]
              hover:border-blue-200
              hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]
              transition-all duration-300
            "
          >
            <p className="text-xs text-slate-400 mb-4">
              Risk Distribution
            </p>
            <Doughnut data={doughnutData} />
          </motion.div>

          {/* ===== BAR ===== */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              bg-white/90 border border-slate-100
              rounded-xl p-5
              shadow-[0_6px_18px_rgba(0,0,0,0.06)]
              hover:border-blue-200
              hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)]
              transition-all duration-300
            "
          >
            <p className="text-xs text-slate-400 mb-4">
              Top Flood Districts
            </p>
            <Bar data={barData} options={barOptions} />
          </motion.div>
        </>
      )}
    </motion.aside>
  );
}