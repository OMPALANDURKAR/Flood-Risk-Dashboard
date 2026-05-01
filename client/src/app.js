import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AnalyticsPanel from "./components/AnalyticsPanel";

import "leaflet/dist/leaflet.css";

// Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/floods",
});

function App() {
  const [floodData, setFloodData] = useState([]);
  const [analytics, setAnalytics] = useState({
    activeHigh: 0,
    activeMedium: 0,
    activeLow: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    risk: "All",
    rainfall: 400,
  });

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const dataRes = await API.get("/");
      const statRes = await API.get("/analytics");

      const floodArray = Array.isArray(dataRes.data)
        ? dataRes.data
        : dataRes.data?.data || [];

      const analyticsData =
        statRes.data?.data || statRes.data || {};

      setFloodData(floodArray);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFloodData([]);
    }
  };

  // =========================
  // FILTER DATA
  // =========================
  const filteredData = Array.isArray(floodData)
    ? floodData.filter((d) =>
        (d.land_cover || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        (filters.risk === "All" || d.riskLevel === filters.risk) &&
        Number(d.rainfall_mm) <= filters.rainfall
      )
    : [];

  return (
    <div className="
      h-screen w-screen flex flex-col
      bg-slate-50 text-slate-800
      font-sans overflow-hidden
    ">

      {/* ===== HEADER ===== */}
      <div className="
        h-[72px] flex-shrink-0 
        sticky top-0 z-20
      ">
        <Header />
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="
        flex-1 min-h-0 
        grid grid-cols-[320px_1fr_320px] 
        gap-4 p-4
      ">

        {/* ===== SIDEBAR ===== */}
        <div className="min-h-0 overflow-hidden">
          <Sidebar
            setDistrict={(val) =>
              setFilters((prev) => ({ ...prev, search: val }))
            }
          />
        </div>

        {/* ===== MAP ===== */}
        <div className="min-h-0 overflow-hidden">
          <MapView data={filteredData} />
        </div>

        {/* ===== ANALYTICS ===== */}
        <div className="min-h-0 overflow-hidden">
          <AnalyticsPanel analytics={analytics} />
        </div>

      </div>
    </div>
  );
}

export default App;