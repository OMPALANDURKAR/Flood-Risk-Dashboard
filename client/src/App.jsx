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

  // ✅ Robust fetch (handles both API formats)
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
      console.error('API Error:', error);
      setFloodData([]);
    }
  };

  // ✅ Safe filtering
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

    {/* HEADER (FIXED HEIGHT) */}
    <div className="h-16 flex items-center px-6 border-b bg-white">
      <Header />
    </div>

    {/* MAIN DASHBOARD */}
    <div className="flex flex-1 overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-72 border-r bg-white overflow-y-auto">
        <Sidebar filters={filters} setFilters={setFilters} />
      </div>

      {/* MAP (CENTER) */}
      <div className="flex-1 relative">
        <MapView data={filteredData} />
      </div>

      {/* ANALYTICS */}
      <div className="w-80 border-l bg-white overflow-y-auto">
        <AnalyticsPanel analytics={analytics} />
      </div>

    </div>
  </div>
);
}

export default App;