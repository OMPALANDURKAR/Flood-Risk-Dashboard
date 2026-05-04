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
  });

  // ✅ SINGLE SOURCE OF TRUTH
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

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
  // FILTER FOR SIDEBAR ONLY
  // =========================
  const filteredData = Array.isArray(floodData)
    ? floodData.filter((d) =>
        (d.district || "")
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      )
    : [];

  // 🔍 DEBUG
  console.log("APP STATE:", selectedDistrictData);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 text-slate-800">

      {/* ===== HEADER ===== */}
      <div className="h-[72px] sticky top-0 z-20">
        <Header selectedDistrictData={selectedDistrictData} />
      </div>

      {/* ===== MAIN ===== */}
      <div className="flex-1 grid grid-cols-[320px_1fr_320px] gap-4 p-4">

        {/* SIDEBAR */}
        <Sidebar
          setDistrict={(val) =>
            setFilters((prev) => ({ ...prev, search: val }))
          }
          selectedDistrictData={selectedDistrictData}
          filteredData={filteredData}
        />

        {/* 🔥 FIXED MAP CONNECTION */}
        <MapView
          district={filters.search}
          setSelectedDistrictData={(data) => {
            console.log("FROM MAP:", data);
            setSelectedDistrictData({ ...data }); // force re-render
          }}
        />

        {/* ANALYTICS */}
        <AnalyticsPanel analytics={analytics} />
      </div>

      {/* REPORT CONTENT */}
      {selectedDistrictData?.district && (
        <div
          id="report-content"
          style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            width: "800px",
            padding: "24px",
            background: "white",
          }}
        >
          <h1>Flood Risk Report</h1>
          <h2>{selectedDistrictData.district}</h2>

          <p>Rainfall: {selectedDistrictData.rainfall?.toFixed(1)} mm</p>
          <p>Water Level: {selectedDistrictData.waterLevel?.toFixed(1)} m</p>
          <p>Discharge: {selectedDistrictData.discharge?.toFixed(0)} m³/s</p>
          <p>Humidity: {selectedDistrictData.humidity?.toFixed(0)}%</p>
          <p>Elevation: {selectedDistrictData.elevation?.toFixed(0)} m</p>
          <p>Flood History: {selectedDistrictData.historicalFloods}</p>
        </div>
      )}

    </div>
  );
}

export default App;