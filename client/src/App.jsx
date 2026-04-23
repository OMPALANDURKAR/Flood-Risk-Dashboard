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

  // 🔥 FINAL FIXED FETCH LOGIC
  const fetchData = async () => {
    try {
      const dataRes = await API.get('/');
      const statRes = await API.get('/analytics');

      // ✅ Handle BOTH response types (array OR {data: []})
      const floodArray = Array.isArray(dataRes.data)
        ? dataRes.data
        : dataRes.data?.data || [];

      const analyticsData = statRes.data?.data || statRes.data || {};

      setFloodData(floodArray);
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('API Error:', error);
      setFloodData([]); // fallback safety
    }
  };

  // ✅ Safe filter (prevents crash if not array)
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
    <div className="flex flex-col h-screen bg-gray-50 text-slate-800">

      {/* Header */}
      <Header />

      {/* Main Layout */}
      <div className="flex flex-1 h-full overflow-hidden">

        {/* Sidebar */}
        <Sidebar filters={filters} setFilters={setFilters} />

        {/* Map */}
        <main className="flex-1 h-full">
          <MapView data={filteredData} />
        </main>

        {/* Analytics */}
        <AnalyticsPanel analytics={analytics} />

      </div>
    </div>
  );
}

export default App;