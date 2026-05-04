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

export default function AnalyticsPanel({ setSelectedDistrict }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      console.error("Analytics fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SAFE LOADING
  // =========================
  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-40 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (!analytics || !analytics.distribution || !analytics.topDistricts) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Loading analytics...
      </div>
    );
  }

  // =========================
  // SAFE DATA
  // =========================
  const total = analytics.total || 0;
  const floods = analytics.floods || 0;
  const distribution = analytics.distribution || { high: 0, medium: 0, low: 0 };
  const topDistricts = analytics.topDistricts || [];
  const driver = analytics.driver || { type: "N/A", percent: 0 };

  // =========================
  // INSIGHT
  // =========================
  const dominant =
    distribution.low > distribution.medium &&
    distribution.low > distribution.high
      ? "Most districts are currently stable"
      : distribution.high > distribution.medium
      ? "High-risk districts require attention"
      : "Moderate flood risk across regions";

  // =========================
  // CHART DATA
  // =========================
  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          distribution.high,
          distribution.medium,
          distribution.low,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: topDistricts.length
      ? topDistricts.map((d) => d.name)
      : [],
    datasets: [
      {
        label: "Risk Score",
        data: topDistricts.map((d) => d.value),
        backgroundColor: "#3b82f6",
        borderRadius: 6,
      },
    ],
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="h-full flex flex-col gap-6 p-6 bg-white/80 border rounded-2xl"
    >
      {/* HEADER */}
      <div>
        <p className="text-xs font-bold uppercase text-slate-400">
          Insights
        </p>
        <h2 className="text-lg font-semibold">
          Analytics Dashboard
        </h2>
      </div>

      {/* ================= KPI ================= */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Total Records" value={total} color="text-blue-600" />
        <Card title="Flood Events" value={floods} color="text-red-500" />
        <Card title="High Risk Zones" value={distribution.high} color="text-red-500" />
        <Card
          title="Avg Risk Score"
          value={Math.round(
            (distribution.high * 3 +
              distribution.medium * 2 +
              distribution.low) /
              (total || 1)
          )}
          color="text-amber-500"
        />
      </div>

      {/* ================= ALERT ================= */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
        ⚠️ {dominant}
      </div>

      {/* ================= RISK SECTION ================= */}
      <div className="grid grid-cols-2 gap-4">

        {/* DONUT */}
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm font-semibold mb-3">
            Risk Distribution
          </p>
          <Doughnut data={doughnutData} />
        </div>

        {/* INSIGHT PANEL */}
        <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-3">
          <p className="text-sm font-semibold">
            Risk Insights
          </p>

          <div className="text-sm text-slate-600">
            {dominant}
          </div>

          <div className="text-xs space-y-1">
            <p>🔴 High: {distribution.high}</p>
            <p>🟡 Medium: {distribution.medium}</p>
            <p>🟢 Low: {distribution.low}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-2 text-xs mt-2">
            🧠 Primary Driver:{" "}
            <span className="font-semibold">
              {driver.type} ({driver.percent}%)
            </span>
          </div>
        </div>

      </div>

      {/* ================= BAR ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm font-semibold mb-3">
          Top Risk Districts
        </p>

        <Bar
          data={barData}
          options={{
            onClick: (evt, elements) => {
              if (elements.length > 0 && setSelectedDistrict) {
                const index = elements[0].index;
                const district = topDistricts[index]?.name;
                if (district) setSelectedDistrict(district);
              }
            }
          }}
        />
      </div>

    </motion.aside>
  );
}

// ================= CARD =================
function Card({ title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-4 rounded-xl shadow"
    >
      <p className="text-xs text-slate-500">{title}</p>
      <h2 className={`text-xl font-bold ${color}`}>{value}</h2>
    </motion.div>
  );
}