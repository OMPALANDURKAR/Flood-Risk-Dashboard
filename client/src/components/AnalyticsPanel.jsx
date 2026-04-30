import { useEffect, useState } from "react";
import { getAnalytics } from "../api/data";

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

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function AnalyticsPanel() {
  const [data, setData] = useState({});

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setData(res.data || {});
    } catch (err) {
      console.error("Analytics fetch error", err);
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
  // DONUT CHART (RISK)
  // =========================
  const doughnutData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [high, medium, low],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
        borderWidth: 1,
      },
    ],
  };

  // =========================
  // BAR CHART (TOP DISTRICTS)
  // =========================
  const topDistricts = Object.entries(data)
    .sort((a, b) => b[1].floods - a[1].floods)
    .slice(0, 5);

  const barData = {
    labels: topDistricts.map((d) => d[0]),
    datasets: [
      {
        label: "Flood Events",
        data: topDistricts.map((d) => d[1].floods),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="h-full flex flex-col gap-4">

      {/* TITLE */}
      <h2 className="text-sm font-bold">📊 Analytics</h2>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-3">

        <div className="card">
          <p className="text-xs text-gray-400">Total Records</p>
          <h3 className="text-xl font-bold text-blue-400">{total}</h3>
        </div>

        <div className="card">
          <p className="text-xs text-gray-400">Flood Events</p>
          <h3 className="text-xl font-bold text-red-400">{floods}</h3>
        </div>

      </div>

      {/* DONUT CHART */}
      <div className="card">
        <p className="text-xs text-gray-400 mb-2">Risk Distribution</p>
        <Doughnut data={doughnutData} />
      </div>

      {/* BAR CHART */}
      <div className="card">
        <p className="text-xs text-gray-400 mb-2">Top Flood Districts</p>
        <Bar data={barData} />
      </div>

    </div>
  );
}