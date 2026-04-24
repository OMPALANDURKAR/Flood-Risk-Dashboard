import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import AnalyticsPanel from './components/AnalyticsPanel';
import 'leaflet/dist/leaflet.css';

// Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api/floods'
});

function App() {
  const [floodData, setFloodData] = useState([]);
  const [analytics, setAnalytics] = useState({
    activeHigh: 0,
    activeMedium: 0,
    activeLow: 0
  });

  const [filters, setFilters] = useState({
    search: '',
    risk: 'All',
    rainfall: 400
  });

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Robust API handling (handles both formats)
  const fetchData = async () => {
    try {
      const dataRes = await API.get('/');
      const statRes = await API.get('/analytics');

      const floodArray = Array.isArray(dataRes.data)
        ? dataRes.data
        : dataRes.data?.data || [];

      const analyticsData =
        statRes.data?.data || statRes.data || {};

      setFloodData(floodArray);
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error fetching data:', error);
      setFloodData([]);
    }
  };

  // ✅ Safe filtering (no crashes)
  const filteredData = Array.isArray(floodData)
    ? floodData.filter((d) =>
        (d.land_cover || '')
          .toLowerCase()
          .includes(filters.search.toLowerCase()) &&
        (filters.risk === 'All' || d.riskLevel === filters.risk) &&
        Number(d.rainfall_mm) <= filters.rainfall
      )
    : [];

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">

      {/* ===== HEADER ===== */}
      <header className="h-16 flex-shrink-0 border-b bg-white z-10">
        <Header />
      </header>

      {/* ===== MAIN LAYOUT ===== */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* ===== SIDEBAR ===== */}
        <aside className="w-72 flex-shrink-0 overflow-y-auto border-r bg-white">
          <Sidebar filters={filters} setFilters={setFilters} />
        </aside>

        {/* ===== MAP (CRITICAL FIX AREA) ===== */}
        <main className="flex-1 min-h-0 relative">
          <MapView data={filteredData} />
        </main>

        {/* ===== ANALYTICS ===== */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto border-l bg-white">
          <AnalyticsPanel analytics={analytics} />
        </aside>

      </div>
    </div>
  );
}

export default App;