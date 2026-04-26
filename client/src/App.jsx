import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import AnalyticsPanel from './components/AnalyticsPanel';
import 'leaflet/dist/leaflet.css';

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

  const fetchData = async () => {
    try {
      const dataRes = await API.get('/');
      const statRes = await API.get('/analytics');

      const floodArray = Array.isArray(dataRes.data)
        ? dataRes.data
        : dataRes.data?.data || [];

      const analyticsData = statRes.data?.data || statRes.data || {};

      setFloodData(floodArray);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('API Error:', error);
      setFloodData([]);
    }
  };

  const filteredData = Array.isArray(floodData)
    ? floodData.filter((d) =>
        (d.land_cover || '').toLowerCase().includes(filters.search.toLowerCase()) &&
        (filters.risk === 'All' || d.riskLevel === filters.risk) &&
        Number(d.rainfall_mm) <= filters.rainfall
      )
    : [];

  return (
    // Changed: Soft background color to make the white cards pop
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50">
      
      {/* ===== HEADER ===== */}
      <div className="flex-shrink-0 z-20 shadow-sm relative">
        <Header />
      </div>

      {/* ===== MAIN DASHBOARD ===== */}
      {/* Changed: Added padding (p-4) and gap (gap-4) for the floating card effect */}
      <div className="flex flex-1 min-h-0 overflow-hidden p-4 gap-4">

        {/* ===== SIDEBAR ===== */}
        {/* Changed: Rounded corners and soft shadows */}
        <div className="w-72 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-y-auto flex-shrink-0">
          <Sidebar filters={filters} setFilters={setFilters} />
        </div>

        {/* ===== MAP (CENTER) ===== */}
        {/* Changed: Map container is now a rounded card with a border */}
        <div className="flex-1 min-h-0 rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-200">
          <MapView data={filteredData} />
        </div>

        {/* ===== ANALYTICS ===== */}
        {/* Changed: Rounded corners and soft shadows */}
        <div className="w-80 bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-y-auto flex-shrink-0">
          <AnalyticsPanel analytics={analytics} />
        </div>

      </div>
    </div>
  );
}

export default App;