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

export default function App() {
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

      const floodArray = Array.isArray(dataRes.data) ? dataRes.data : dataRes.data?.data || [];
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
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* HEADER WRAPPER */}
      <div className="h-[72px] flex-shrink-0 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl z-20 shadow-sm sticky top-0">
        <div className="h-full w-full mx-auto px-6">
          <Header />
        </div>
      </div>

      {/* MAIN DASHBOARD */}
      <div className="flex flex-1 min-h-0 p-5 gap-5 w-full max-w-[1920px] mx-auto">

        {/* SIDEBAR WRAPPER */}
        <div className="w-80 flex-shrink-0 flex flex-col relative group z-10">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/20 to-transparent rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
          <div className="relative h-full w-full rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <Sidebar filters={filters} setFilters={setFilters} />
          </div>
        </div>

        {/* MAP WRAPPER */}
        <div className="flex-1 min-w-0 min-h-0 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 flex flex-col z-0 group">
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] z-[400] transition-opacity duration-700 group-hover:opacity-80"></div>
          <MapView data={filteredData} />
        </div>

        {/* ANALYTICS WRAPPER */}
        <div className="w-[340px] flex-shrink-0 flex flex-col relative group z-10">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-[2rem] blur opacity-30 group-hover:opacity-50 transition duration-700"></div>
          <div className="relative h-full w-full rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
            <AnalyticsPanel analytics={analytics} />
          </div>
        </div>

      </div>
    </div>
  );
}